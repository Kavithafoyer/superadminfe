'use client';

import { useRef, useState, type FormEvent } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Building2, Check, Code, FileDown, GraduationCap, Layers, Link2, Plus, Puzzle, Search, Shield, ShoppingCart, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import {
  compatibilityLabels, type CompatibilityInput, type CompatibilityRule, type CompatibilityType,
  useDeleteCompatibilityRuleMutation, useFilterCompatibilityRulesQuery, useGetCompatibilityMatrixQuery,
  useGetCompatibilityRuleQuery, useListCompatibilityRulesQuery, useSaveCompatibilityRuleMutation,
  useSearchCompatibilityRulesQuery,
} from '@/service/api/addonProductCompatibilityApi';
import { useGetMarketplaceAddonsQuery, useGetMarketplaceAddonProductsQuery } from '@/service/api/marketplaceAddonApi';
import { CategoryIcon } from '../categories/categoryIcons';

const tabs = ['Compatibility Matrix', 'Rules & Dependencies', 'Conflicts', 'Version Compatibility'] as const;
const emptyFilters = { product: '', category: '' };
const fieldClass = 'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm';
const cardClass = 'min-w-0 rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900';
const primaryClass = 'h-10 bg-[#6d19e8] text-white hover:bg-[#5814bd]';
const statusColors = {
  compatible: 'text-green-700 dark:text-green-400',
  incompatible: 'text-red-600 dark:text-red-400',
  dependency: 'text-violet-700 dark:text-violet-300',
};

function ruleType(rule: CompatibilityRule): CompatibilityType {
  return rule.Compatibility_Type || (rule.Is_Compatible ? 'compatible' : 'incompatible');
}

function ProductIcon({ name }: { name: string }) {
  const Icon = /education|school/i.test(name) ? GraduationCap
    : /people|hrms/i.test(name) ? Users
    : /retail|commerce/i.test(name) ? ShoppingCart
    : /real estate/i.test(name) ? Building2
    : /\bit\b|software/i.test(name) ? Code
    : /crm/i.test(name) ? Shield : Layers;
  return <Icon aria-hidden="true" className="size-6 text-violet-700 dark:text-violet-300" />;
}

function RuleStatus({ rule }: { rule: CompatibilityRule }) {
  const type = ruleType(rule);
  const Icon = type === 'compatible' ? Check : type === 'dependency' ? Link2 : X;
  const label = rule.Is_Active ? compatibilityLabels[type] : 'Inactive rule';
  return (
    <span title={label} className={`inline-flex ${rule.Is_Active ? statusColors[type] : 'text-muted-foreground'}`}>
      <Icon aria-hidden="true" className="size-5" strokeWidth={2.5} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function apiError(error: unknown, fallback: string) {
  const failure = error as { data?: unknown; error?: string; status?: number | string; originalStatus?: number } | undefined;
  const data = failure?.data;
  if (!data || typeof data !== 'object') {
    const status = failure?.originalStatus ?? failure?.status;
    return typeof status === 'number' ? `${fallback} (HTTP ${status})` : failure?.error || fallback;
  }
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return `${key.replaceAll('_', ' ')}. ${value[0]}`;
  }
  return failure?.error || fallback;
}

type Option = { id: number; name: string; category?: string };
type Selection = { id: number } | { addon?: number; product?: number };

function RuleEditor({ rule, selection, addons, products, onSaved, onClose }: {
  rule?: CompatibilityRule;
  selection: Selection;
  addons: Option[];
  products: Option[];
  onSaved: (rule: CompatibilityRule) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    Addon: rule?.Addon ?? ('addon' in selection ? selection.addon : undefined) ?? 0,
    Product: rule?.Product ?? ('product' in selection ? selection.product : undefined) ?? 0,
    Compatibility_Type: rule ? ruleType(rule) : 'compatible' as CompatibilityType,
    Dependencies: rule?.Dependencies ?? [],
    Version_Constraint: rule?.Version_Constraint ?? false,
    Minimum_Version: rule?.Minimum_Version ?? '',
    Maximum_Version: rule?.Maximum_Version ?? '',
    Rule_Description: rule?.Rule_Description ?? '',
    Is_Active: rule?.Is_Active ?? true,
  });
  const [save, saveState] = useSaveCompatibilityRuleMutation();
  const [remove, deleteState] = useDeleteCompatibilityRuleMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [failure, setFailure] = useState('');
  const lock = useRef(false);
  const busy = saveState.isLoading || deleteState.isLoading;
  const addon = addons.find(({ id }) => id === form.Addon);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    if (!form.Addon || !form.Product) {
      setFailure('Select an add-on and a product.');
      return;
    }
    const input: CompatibilityInput = {
      ...form,
      Minimum_Version: form.Minimum_Version.trim(),
      Maximum_Version: form.Maximum_Version.trim(),
    };
    lock.current = true;
    setFailure('');
    try {
      const saved = await save({ ...input, id: rule?.id }).unwrap();
      toast.success(rule ? 'Compatibility rule updated.' : 'Compatibility rule created.');
      onSaved(saved);
    } catch (error) {
      setFailure(apiError(error, 'Unable to save the rule.'));
    } finally {
      lock.current = false;
    }
  }

  async function deleteRule() {
    if (!rule || lock.current) return;
    lock.current = true;
    setFailure('');
    try {
      await remove(rule.id).unwrap();
      setConfirmDelete(false);
      onClose();
      toast.success('Compatibility rule removed.');
    } catch (error) {
      setConfirmDelete(false);
      setFailure(apiError(error, 'Unable to remove the rule.'));
    } finally {
      lock.current = false;
    }
  }

  return (
    <>
      <form onSubmit={submit} className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#f3eafa] p-4 dark:bg-purple-950/65">
          <h2 className="text-lg font-semibold">{rule ? 'Compatibility Rule Details' : 'Create Compatibility Rule'}</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${form.Is_Active ? 'bg-green-700 text-white' : 'bg-rose-100 text-rose-800'}`}>
            {form.Is_Active ? 'Active' : 'Inactive'}
          </span>
        </div>
        {addon && (
          <div className="flex items-center gap-3 px-4 pt-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-purple-100 dark:bg-purple-900">
              <CategoryIcon categoryName={addon.category} className="size-7 text-violet-700 dark:text-purple-200" />
            </span>
            <div><p className="font-bold">{addon.name}</p><p className="text-sm text-muted-foreground">{addon.category}</p></div>
          </div>
        )}
        <fieldset disabled={busy} className="space-y-4 p-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 font-medium"><span>Add-on</span>
              <select required disabled={!!rule} className={fieldClass} value={form.Addon || ''} onChange={(event) => {
                const id = Number(event.target.value);
                setForm({ ...form, Addon: id, Dependencies: form.Dependencies.filter((item) => item !== id) });
              }}>
                <option value="">Select add-on</option>
                {addons.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
            <label className="space-y-1 font-medium"><span>Product</span>
              <select required disabled={!!rule} className={fieldClass} value={form.Product || ''} onChange={(event) => setForm({ ...form, Product: Number(event.target.value) })}>
                <option value="">Select product</option>
                {products.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
          </div>
          <fieldset className="space-y-2">
            <legend className="font-medium">Compatibility type</legend>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(compatibilityLabels) as CompatibilityType[]).map((type) => (
                <label key={type} className="flex items-center gap-1.5">
                  <input type="radio" name="rule-type" className="accent-violet-700" checked={form.Compatibility_Type === type}
                    onChange={() => setForm({ ...form, Compatibility_Type: type })} />
                  {compatibilityLabels[type]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="space-y-2">
            <label htmlFor="compatibility-dependency" className="font-medium">Dependencies</label>
            <div className="flex flex-wrap gap-2">
              {form.Dependencies.map((id) => (
                <button key={id} type="button" className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-1 text-violet-900 dark:bg-purple-900 dark:text-purple-100"
                  aria-label={`Remove dependency ${addons.find((item) => item.id === id)?.name ?? id}`}
                  onClick={() => setForm({ ...form, Dependencies: form.Dependencies.filter((item) => item !== id) })}>
                  {addons.find((item) => item.id === id)?.name ?? `Add-on #${id}`} <X className="size-3" aria-hidden="true" />
                </button>
              ))}
            </div>
            <select id="compatibility-dependency" className={fieldClass} value="" onChange={(event) => {
              const id = Number(event.target.value);
              if (id) setForm({ ...form, Dependencies: [...form.Dependencies, id] });
            }}>
              <option value="">Add a dependency</option>
              {addons.filter(({ id }) => id !== form.Addon && !form.Dependencies.includes(id)).map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" className="accent-violet-700" checked={form.Version_Constraint}
              onChange={(event) => setForm({ ...form, Version_Constraint: event.target.checked })} />
            Apply version constraint
          </label>
          {form.Version_Constraint && (
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1"><span>Minimum version</span>
                <Input maxLength={100} placeholder="e.g. 2.0.0" value={form.Minimum_Version} className="mb-0 h-10"
                  onChange={(event) => setForm({ ...form, Minimum_Version: event.target.value })} />
              </label>
              <label className="space-y-1"><span>Maximum version</span>
                <Input maxLength={100} placeholder="e.g. 3.9.9" value={form.Maximum_Version} className="mb-0 h-10"
                  onChange={(event) => setForm({ ...form, Maximum_Version: event.target.value })} />
              </label>
            </div>
          )}
          <label className="block space-y-1 font-medium"><span>Rule description</span>
            <textarea rows={3} value={form.Rule_Description} className="w-full rounded-lg border border-input bg-background px-3 py-2"
              onChange={(event) => setForm({ ...form, Rule_Description: event.target.value })} />
          </label>
          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" className="accent-violet-700" checked={form.Is_Active} onChange={(event) => setForm({ ...form, Is_Active: event.target.checked })} />
            Active rule
          </label>
          {failure && <p role="alert" className="text-red-700 dark:text-red-300">{failure}</p>}
          <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-4">
            {rule && <Button type="button" variant="ghost" onClick={() => setConfirmDelete(true)} className="text-red-700 dark:text-red-300">Remove rule</Button>}
            <div className="ml-auto flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className={primaryClass}>{saveState.isLoading ? 'Saving…' : 'Save Rule'}</Button>
            </div>
          </div>
        </fieldset>
      </form>
      <ConfirmDeleteDialog isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={deleteRule}
        loading={deleteState.isLoading} title="Remove compatibility rule" description="Remove the rule for this add-on and product?" />
    </>
  );
}

export function ProductCompatibilityScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [search, setSearch] = useState('');
  const term = search.trim();
  const debounced = useDebounce(term, 300);
  const matrixQuery = useGetCompatibilityMatrixQuery();
  const addonQuery = useGetMarketplaceAddonsQuery();
  const productQuery = useGetMarketplaceAddonProductsQuery();
  const listQuery = useListCompatibilityRulesQuery(tab === tabs[0] ? skipToken : undefined);
  const searchQuery = useSearchCompatibilityRulesQuery(debounced && term === debounced ? debounced : skipToken);
  const filterQuery = useFilterCompatibilityRulesQuery(applied.product ? { Product: Number(applied.product) } : skipToken);
  const detail = useGetCompatibilityRuleQuery(selection && 'id' in selection ? selection.id : skipToken);
  const allRules = matrixQuery.currentData ?? [];
  const addonOptions = new Map<number, Option>(allRules.map((rule) => [rule.Addon, { id: rule.Addon, name: rule.Addon_Name || `Add-on #${rule.Addon}` }]));
  for (const addon of addonQuery.currentData ?? []) {
    addonOptions.set(addon.id, { id: addon.id, name: addon.Addon_Name || `Add-on #${addon.id}`, category: addon.Category ?? undefined });
  }
  const productOptions = new Map<number, Option>(allRules.map((rule) => [rule.Product, { id: rule.Product, name: rule.Product_Name || `Product #${rule.Product}` }]));
  for (const product of productQuery.currentData ?? []) {
    productOptions.set(product.id, { id: product.id, name: product.product_name || product.name || `Product #${product.id}` });
  }
  const addons = [...addonOptions.values()];
  const products = [...productOptions.values()];
  const categories = [...new Set(addons.flatMap(({ category }) => category ? [category] : []))].sort();
  const matchingSearch = new Set(searchQuery.currentData?.map(({ id }) => id));
  const matchingProduct = new Set(filterQuery.currentData?.map(({ id }) => id));
  const baseRules = tab === tabs[0] ? allRules : listQuery.currentData ?? [];
  const rules = baseRules.filter((rule) =>
    (!term || matchingSearch.has(rule.id)) &&
    (!applied.product || matchingProduct.has(rule.id)) &&
    (!applied.category || addonOptions.get(rule.Addon)?.category === applied.category) &&
    (tab !== 'Conflicts' || (rule.Is_Active && ruleType(rule) === 'incompatible')) &&
    (tab !== 'Version Compatibility' || rule.Version_Constraint)
  );
  const ruleByPair = new Map(rules.map((rule) => [`${rule.Addon}:${rule.Product}`, rule]));
  const filteredAddons = new Set(rules.map(({ Addon }) => Addon));
  const matrixAddons = addons.filter(({ id, category }) =>
    (!applied.category || applied.category === category) && (!(term || applied.product) || filteredAddons.has(id))
  );
  const matrixProducts = applied.product ? products.filter(({ id }) => String(id) === applied.product) : products;
  const failedQuery = [matrixQuery, addonQuery, productQuery, listQuery, searchQuery, filterQuery].find((query) => query.isError);
  const loading = matrixQuery.isLoading || addonQuery.isLoading || productQuery.isLoading || listQuery.isLoading ||
    Boolean(term && (term !== debounced || searchQuery.isFetching)) || filterQuery.isFetching;
  const newRuleDisabled = !addons.length || !products.length || addonQuery.isError || productQuery.isError;

  async function exportRules() {
    try {
      const XLSX = await import('xlsx');
      const rows = rules.map((rule) => ({
        'Add-on': addonOptions.get(rule.Addon)?.name ?? rule.Addon,
        Product: productOptions.get(rule.Product)?.name ?? rule.Product,
        Compatibility: compatibilityLabels[ruleType(rule)],
        Status: rule.Is_Active ? 'Active' : 'Inactive',
        Dependencies: rule.Dependencies?.map((id) => addonOptions.get(id)?.name ?? id).join(', ') ?? '',
        'Minimum version': rule.Version_Constraint ? rule.Minimum_Version : '',
        'Maximum version': rule.Version_Constraint ? rule.Maximum_Version : '',
        Description: rule.Rule_Description ?? '',
      }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Compatibility');
      XLSX.writeFile(workbook, 'product-compatibility.xlsx');
    } catch {
      toast.error('Unable to export compatibility rules.');
    }
  }

  return (
    <div className="space-y-5 pb-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Add-on Marketplace / Product Compatibility</p>
          <h1 className="text-3xl font-bold tracking-tight">Product Compatibility</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage which products support each add-on and the conditions that apply.</p>
        </div>
        <Button type="button" className={primaryClass} disabled={newRuleDisabled} onClick={() => setSelection({})}>
          <Plus /> Create Compatibility Rule
        </Button>
      </header>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {[
          { label: 'Total Products', count: products.length, Icon: Layers, color: 'bg-purple-100 text-violet-700 dark:bg-purple-950 dark:text-purple-300' },
          { label: 'Total Add-ons', count: addons.length, Icon: Puzzle, color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
          { label: 'Compatibility Rules', count: allRules.length, Icon: Check, color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
          { label: 'Conflicts', count: allRules.filter((rule) => rule.Is_Active && ruleType(rule) === 'incompatible').length, Icon: X, color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
          { label: 'Dependencies', count: allRules.reduce((sum, rule) => sum + (rule.Dependencies?.length ?? 0), 0), Icon: Link2, color: 'bg-purple-100 text-violet-700 dark:bg-purple-950 dark:text-purple-300' },
        ].map(({ label, count, Icon, color }) => (
          <div key={label} className={`${cardClass} flex items-center gap-3 p-3`}>
            <span className={`grid size-11 shrink-0 place-items-center rounded-full ${color}`}><Icon aria-hidden="true" className="size-6" /></span>
            <div><dt className="text-sm font-medium">{label}</dt><dd className="text-2xl font-bold tabular-nums">{loading ? '—' : count}</dd></div>
          </div>
        ))}
      </dl>
      <div role="group" aria-label="Compatibility views" className="flex flex-wrap gap-3 border-b border-border">
        {tabs.map((name) => (
          <button key={name} type="button" aria-pressed={tab === name} onClick={() => setTab(name)}
            className={`border-b-2 px-3 py-2 text-sm font-semibold ${tab === name ? 'border-violet-700 text-violet-700 dark:text-violet-300' : 'border-transparent text-muted-foreground'}`}>
            {name}
          </button>
        ))}
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,9fr)_minmax(0,5fr)]">
        <div className="min-w-0 space-y-3">
          <form aria-label="Filter compatibility rules" className={`${cardClass} flex flex-wrap items-end gap-3 p-4`}
            onSubmit={(event) => { event.preventDefault(); setApplied(filters); }}>
            <label className="min-w-32 flex-1 space-y-1 text-sm font-medium"><span>Product</span>
              <select className={fieldClass} value={filters.product} onChange={(event) => setFilters({ ...filters, product: event.target.value })}>
                <option value="">All products</option>
                {products.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
            <label className="min-w-32 flex-1 space-y-1 text-sm font-medium"><span>Add-on category</span>
              <select className={fieldClass} value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
                <option value="">All categories</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <Button type="button" variant="ghost" className="h-10" onClick={() => { setFilters(emptyFilters); setApplied(emptyFilters); setSearch(''); }}>Reset</Button>
            <Button type="submit" className={primaryClass}>Apply</Button>
          </form>
          <section className={`${cardClass} overflow-hidden`} aria-busy={loading}>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <h2 className="text-lg font-semibold">{tab}</h2>
              <div className="relative w-full max-w-xs">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" aria-label="Search compatibility rules" placeholder="Search add-on or product" className="mb-0 h-10 pl-9"
                  value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <Button type="button" variant="outline" disabled={loading || !!failedQuery || !rules.length} onClick={exportRules}>
                <FileDown /> Export
              </Button>
            </div>
            {failedQuery ? (
              <div role="alert" className="flex flex-wrap items-center gap-3 border-t border-border p-4 text-sm">
                {apiError(failedQuery.error, 'Unable to load compatibility data.')}
                <Button type="button" variant="outline" onClick={() => failedQuery.refetch()}>Retry</Button>
              </div>
            ) : loading ? <p role="status" className="p-4 text-sm text-muted-foreground">Loading compatibility data…</p> : tab === tabs[0] ? (
              <>
                <div className="flex flex-wrap gap-3 px-4 pb-3 text-xs text-muted-foreground">
                  <span><Check aria-hidden="true" className="mr-1 inline size-4 text-green-700" /> Compatible</span>
                  <span><X aria-hidden="true" className="mr-1 inline size-4 text-red-600" /> Not compatible</span>
                  <span><Link2 aria-hidden="true" className="mr-1 inline size-4 text-violet-700" /> Requires dependency</span>
                  <span>— No rule</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f3eefb] dark:bg-purple-950/60">
                      <tr>
                        <th scope="col" className="min-w-36 p-3">Add-on ({matrixAddons.length})</th>
                        <th scope="col" className="p-3">Category</th>
                        {matrixProducts.map(({ id, name }) => (
                          <th key={id} scope="col" className="min-w-24 border-l border-purple-100 p-3 text-center dark:border-purple-900">
                            <span className="flex flex-col items-center gap-1"><ProductIcon name={name} />{name}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {!matrixAddons.length && <tr><td colSpan={matrixProducts.length + 2} className="p-4 text-muted-foreground">No matching add-ons.</td></tr>}
                      {matrixAddons.map((addon) => (
                        <tr key={addon.id} className="hover:bg-purple-50/60 dark:hover:bg-purple-950/40">
                          <th scope="row" className="p-3 font-semibold text-violet-700 dark:text-violet-300">{addon.name}</th>
                          <td className="p-3">{addon.category && <span className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-2 py-1 text-xs text-violet-900 dark:bg-purple-900 dark:text-purple-100"><CategoryIcon categoryName={addon.category} />{addon.category}</span>}</td>
                          {matrixProducts.map((product) => {
                            const rule = ruleByPair.get(`${addon.id}:${product.id}`);
                            const selected = Boolean(selection && (rule && 'id' in selection ? selection.id === rule.id
                              : 'addon' in selection && selection.addon === addon.id && selection.product === product.id));
                            return (
                              <td key={product.id} className={`p-1 text-center ${selected ? 'bg-purple-100 dark:bg-purple-900' : ''}`}>
                                <button type="button" aria-pressed={selected}
                                  aria-label={`${addon.name}, ${product.name}, ${rule ? rule.Is_Active ? compatibilityLabels[ruleType(rule)] : 'Inactive rule' : 'Create rule'}`}
                                  className="inline-grid size-9 place-items-center rounded-md hover:bg-purple-100 focus-visible:ring-2 focus-visible:ring-violet-600 dark:hover:bg-purple-900"
                                  onClick={() => setSelection(rule ? { id: rule.id } : { addon: addon.id, product: product.id })}>
                                  {rule ? <RuleStatus rule={rule} /> : <span className="text-muted-foreground">—</span>}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f3eefb] dark:bg-purple-950/60"><tr>
                    {['Add-on', 'Product', 'Rule type', 'Dependencies', 'Version range'].map((heading) => <th scope="col" key={heading} className="p-3">{heading}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {!rules.length && <tr><td colSpan={5} className="p-4 text-muted-foreground">No matching rules.</td></tr>}
                    {rules.map((rule) => (
                      <tr key={rule.id}>
                        <th scope="row" className="p-3"><button type="button" className="text-left text-violet-700 hover:underline dark:text-violet-300"
                          onClick={() => setSelection({ id: rule.id })}>{addonOptions.get(rule.Addon)?.name}</button></th>
                        <td className="p-3">{productOptions.get(rule.Product)?.name}</td>
                        <td className="p-3">{compatibilityLabels[ruleType(rule)]}{!rule.Is_Active && ' (inactive)'}</td>
                        <td className="p-3">{rule.Dependencies?.map((id) => addonOptions.get(id)?.name || `#${id}`).join(', ') || '—'}</td>
                        <td className="p-3">{rule.Version_Constraint ? [rule.Minimum_Version && `Min ${rule.Minimum_Version}`, rule.Maximum_Version && `Max ${rule.Maximum_Version}`].filter(Boolean).join(' / ') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
        {selection && 'id' in selection && !detail.currentData ? (
          <div className={`${cardClass} p-4 text-sm`}>
            {detail.isError ? (
              <div role="alert" className="space-y-2">
                <p>{apiError(detail.error, 'Unable to load the rule.')}</p>
                <Button type="button" variant="outline" onClick={() => detail.refetch()}>Retry</Button>
              </div>
            ) : <p role="status">Loading rule details…</p>}
            <Button type="button" variant="ghost" onClick={() => setSelection(null)}>Cancel</Button>
          </div>
        ) : selection ? (
          <RuleEditor key={'id' in selection ? selection.id : `new:${selection.addon ?? ''}:${selection.product ?? ''}`}
            rule={'id' in selection ? detail.currentData : undefined} selection={selection} addons={addons} products={products}
            onClose={() => setSelection((current) => current === selection ? null : current)}
            onSaved={(rule) => setSelection((current) => current === selection ? { id: rule.id } : current)} />
        ) : (
          <aside className={`${cardClass} overflow-hidden`}>
            <h2 className="bg-[#f3eafa] p-4 text-lg font-semibold dark:bg-purple-950/65">Compatibility Rule Details</h2>
            <p className="p-4 text-sm text-muted-foreground">Select a rule to edit it, or choose an empty matrix cell to create one.</p>
          </aside>
        )}
      </div>
    </div>
  );
}
