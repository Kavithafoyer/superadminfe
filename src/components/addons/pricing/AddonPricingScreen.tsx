'use client';

import { useState, type FormEvent } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { BarChart3, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useGetMarketplaceAddonsQuery } from '@/service/api/marketplaceAddonApi';
import { useGetAddonPriceTemplateByIdQuery, useGetAddonPriceTemplatesWithoutPaginationQuery } from '@/service/api/addonPriceTemplateApi';
import {
  useCreateAddonPricingMutation, useDeleteAddonPricingMutation, useGetAddonPricingWithoutPaginationQuery, useUpdateAddonPricingMutation,
  type AddonPricingDto, type PricingOptions,
} from '@/service/api/addonPricingApi';
import { apiError, EditorActions, EditorTabs, Field, field, isActiveSubmit, Money, PricingWorkspace, Status, TierFields, tierDraft, tierPayload, type TierDraft } from '../PricingWorkspace';

type Draft = { id?: number; addon: number; template: number; amount: string; from: string; to: string; options: PricingOptions; tiers?: TierDraft[] };
const blank: Draft = { addon: 0, template: 0, amount: '', from: '', to: '', options: {} };

const planSwitch = 'relative h-5 w-9 cursor-pointer appearance-none rounded-full bg-slate-300 before:absolute before:left-0.5 before:top-0.5 before:size-4 before:rounded-full before:bg-white checked:bg-green-600 checked:before:translate-x-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700';
const models = ['Fixed', 'Per Tenant', 'Per User', 'Per Usage', 'Tiered'];
const pricingModel = (value?: string) => value === 'Usage Based' ? 'Per Usage' : value === 'Tiered Volume' ? 'Tiered' : value || '';
const modelFor = (record: AddonPricingDto) => pricingModel(record.Pricing_Options?.Model || record.License_Model);

export function AddonPricingScreen() {
  const list = useGetAddonPricingWithoutPaginationQuery(undefined, { refetchOnMountOrArgChange: true });
  const addons = useGetMarketplaceAddonsQuery(undefined, { refetchOnMountOrArgChange: true });
  const templates = useGetAddonPriceTemplatesWithoutPaginationQuery({ includeTiers: false }, { refetchOnMountOrArgChange: true });
  const [create, creating] = useCreateAddonPricingMutation();
  const [update, updating] = useUpdateAddonPricingMutation();
  const [remove, deleting] = useDeleteAddonPricingMutation();
  const [tab, setTab] = useState('Pricing Details');
  const [draft, setDraft] = useState<Draft>(blank);
  const [overview, setOverview] = useState<AddonPricingDto | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const busy = creating.isLoading || updating.isLoading || deleting.isLoading;
  const records = list.data ?? [];
  const addon = addons.data?.find(item => item.id === draft?.addon);
  const template = templates.data?.find(item => item.id === draft?.template);
  const templateDetails = useGetAddonPriceTemplateByIdQuery(draft.template || skipToken, { refetchOnMountOrArgChange: true });
  const savedRule = records.find(item => item.id === draft.id);
  const changedTemplate = !!savedRule && savedRule.Price_Template !== draft.template;
  const savedTiers = changedTemplate ? [] : (savedRule?.Tiers ?? []);
  const tiers = draft.tiers ?? (savedTiers.length
    ? [...savedTiers].sort((left, right) => left.Min_Employees - right.Min_Employees).map((row, index) => tierDraft({ ...row, Name: row.Name || 'Tier ' + (index + 1) }))
    : (changedTemplate || !savedRule?.Tier_Schedule?.Customized) ? (templateDetails.currentData?.Tiers ?? []).map(tierDraft) : []);
  const model = draft?.options.Model ?? pricingModel(addon?.License_Model);
  const cycle = draft.options.Billing_Cycle || (template?.Billing_Cycle?.toLowerCase() === 'annual' ? 'Annual' : template?.Billing_Cycle?.toLowerCase() === 'monthly' ? 'Monthly' : '');
  const monthly = records.filter(record => (record.Pricing_Options?.Billing_Cycle || record.Billing_Cycle)?.toLowerCase() === 'monthly' && modelFor(record) !== 'Per Usage' && record.Is_Active && record.Currency);
  const monthlyCurrencies = new Set(monthly.map(record => record.Currency?.split(' ')[0]));
  const average = monthly.length && monthlyCurrencies.size === 1
    ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(monthly.reduce((sum, record) => sum + Number(record.Base_Price), 0) / monthly.length) + ' ' + [...monthlyCurrencies][0]
    : '—';
  const amount = draft?.amount ?? '';

  function open(record?: AddonPricingDto) {
    if (busy || (record && draft.id === record.id)) return;
    setTab('Pricing Details');
    setError('');
    setNotice('');
    setDraft(record ? {
      id: record.id, addon: record.Addon, template: record.Price_Template,
      amount: String(record.Base_Price), options: record.Pricing_Options ?? {},
      from: record.Effective_From ?? '', to: record.Effective_To ?? '',
    } : blank);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!addon || !template || !cycle || busy) return;
    setError('');
    const payload = {
      Addon: addon.id, Price_Template: template.id, Base_Price: amount,
      Pricing_Options: {
        ...draft.options, Model: model || undefined, Billing_Cycle: cycle,
        Marketplace_Visible: draft.options.Marketplace_Visible ?? Boolean(addon.Is_Active),
        Allow_Trial: draft.options.Allow_Trial ?? Boolean(addon.Trial_Available),
        Edition_Rates: draft.options.Edition_Rates?.filter(row => row.Rate !== '' || row.Active),
      },
      ...(draft.tiers !== undefined || changedTemplate ? { Tiers: tierPayload(tiers, true) } : {}),
      Effective_From: draft.from || undefined, Effective_To: draft.to || null,
      Is_Active: isActiveSubmit(event.nativeEvent as SubmitEvent),
    };
    try {
      await (draft.id ? update({ id: draft.id, ...payload }) : create(payload)).unwrap();
      setDraft(blank);
      setTab('Pricing Details');
      setNotice('Pricing rule saved.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  async function deletePricing(id: number) {
    if (!window.confirm('Delete this pricing rule?')) return;
    setDeleteError('');
    try {
      await remove(id).unwrap();
      if (draft.id === id) { setDraft(blank); setTab('Pricing Details'); setError(''); }
      setNotice('Pricing rule deleted.');
    } catch (failure) {
      setDeleteError(apiError(failure));
    }
  }

  return <>
    {notice && <p className="mb-3 text-sm text-emerald-700" role="status">{notice}</p>}
    {deleteError && <p role="alert" className="mb-3 text-sm text-destructive">{deleteError}</p>}
    <PricingWorkspace title="Add-on Pricing" description="Configure pricing, plans, and discounts for marketplace add-ons."
      createLabel="Create Pricing Rule" onCreate={() => open()} pending={list.isLoading || addons.isLoading} failed={list.isError || addons.isError} retry={() => { void list.refetch(); void addons.refetch(); }}
      selectedId={draft.id}
      editorStatus={records.find(item => item.id === draft.id)?.Is_Active}
      editorTitle={draft.id ? 'Edit Add-on Pricing' : 'Create Add-on Pricing'}
      metrics={[
        ['Total Add-ons', addons.data?.length ?? 0],
        ['Priced Add-ons', new Set(records.map(record => record.Addon)).size],
        ['Avg. Monthly Price', average],
        ['Active Revenue (MRR)', '—'],
      ]}
      filterLabels={["Product","Category"]}
      columns={['Add-on Code', 'Add-on Name', 'Category', 'Pricing Model', 'Plans & Price', 'Status']}
      rows={records.map(record => {
        const master = addons.data?.find(item => item.id === record.Addon);
        const assigned = templates.data?.find(item => item.id === record.Price_Template);
        const values = [master?.Addon_Code || record.Addon_Code || '', master?.Addon_Name || record.Addon_Name || '', master?.Category || record.Category || '', modelFor(record)];
        const currency = assigned?.Currency || record.Currency;
        const rates = record.Pricing_Options?.Edition_Rates?.filter(row => row.Active) ?? [];
        const amounts = rates.length ? rates.map(row => row.Rate) : [record.Base_Price];
        return { id: record.id, filters: { Category: values[2], Product: master?.products_details?.map(product => product.Product_Name) ?? [] }, search: [...values, assigned?.Template_Name || record.Price_Template_Name].join(' '), active: record.Is_Active, edit: () => open(record),
          cells: [
            <button type="button" className="font-semibold text-violet-700 underline" onClick={() => open(record)}>{values[0]}</button>,
            values[1], values[2] && <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-900">{values[2]}</span>, values[3], <>{amounts.map((value, index) => <span key={index}>{index > 0 && ' / '}<Money amount={value} currency={currency} /></span>)}</>, <Status active={record.Is_Active} />],
          exportValues: [...values, amounts.join(' / ') + ' ' + (currency ?? ''), record.Is_Active ? 'Active' : 'Draft'],
          actions: <DropdownMenu modal={false}>
            <DropdownMenuTrigger type="button" disabled={busy} aria-label={'Actions for ' + values[1]} className="rounded p-1 text-violet-700 hover:bg-violet-100"><MoreVertical aria-hidden className="size-4" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOverview(record)}><Eye /> Overview</DropdownMenuItem>
              <DropdownMenuItem onClick={() => open(record)}><Pencil /> Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => void deletePricing(record.id)}><Trash2 /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>,
        };
      })}>
      <form className="p-4" onSubmit={save} onInvalidCapture={() => setTab('Pricing Details')}>
        <fieldset className="min-w-0 space-y-4" disabled={busy}>
          {addon && <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700"><BarChart3 aria-hidden className="size-5" /></span>
            <div><p className="font-semibold">{addon.Addon_Name} ({addon.Addon_Code || addon.AddonMaster_Id})</p>
              <p className="text-xs text-muted-foreground">{addon.Category}</p>
            </div>
          </div>}
          <EditorTabs tabs={['Pricing Details', 'Discounts & Offers']} value={tab} change={setTab} />
          {(addons.isError || templates.isError) && <p className="text-sm text-destructive" role="alert">Could not load add-ons or price templates. <button type="button" className="underline" onClick={() => { void addons.refetch(); void templates.refetch(); }}>Retry</button></p>}
          <div hidden={tab !== 'Pricing Details'} className="space-y-4"><div className="grid gap-3 sm:grid-cols-2">
            <Field label="Add-on"><select className={field} required value={draft.addon || ''} onChange={event => {
              const id = Number(event.target.value);
              const selected = addons.data?.find(item => item.id === id);
              const currency = template?.Currency.split(' ')[0];
              const sameCurrency = !currency || !selected?.Currency_code || selected.Currency_code === currency;
              setDraft({ ...draft, addon: id, tiers: undefined, options: {}, amount: sameCurrency ? String(selected?.Price ?? '') : '' });
            }}>
              <option value="">{addons.isLoading ? 'Loading add-ons…' : 'Select add-on'}</option>
              {addons.data?.map(item => <option key={item.id} value={item.id}>{item.Addon_Name}</option>)}
            </select></Field>
            <Field label="Price template"><select className={field} required value={draft.template || ''} onChange={event => {
              const id = Number(event.target.value);
              const selected = templates.data?.find(item => item.id === id);
              const currency = selected?.Currency.split(' ')[0];
              const sameCurrency = !currency || !addon?.Currency_code || addon.Currency_code === currency;
              setDraft({ ...draft, template: id, tiers: undefined, options: { ...draft.options, Billing_Cycle: undefined, Edition_Rates: sameCurrency ? draft.options.Edition_Rates : [] }, amount: sameCurrency ? (amount || String(addon?.Price ?? '')) : '' });
            }}>
              <option value="">{templates.isLoading ? 'Loading templates…' : 'Select price template'}</option>
              {templates.data?.filter(item => item.Is_Active || item.id === draft.template).map(item => <option key={item.id} value={item.id}>{item.Template_Name} ({item.Template_Code})</option>)}
            </select></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Pricing Model"><select className={field} value={model} required onChange={event => setDraft({ ...draft, options: { ...draft.options, Model: event.target.value } })}>
              <option value="">Select pricing model</option>{models.map(value => <option key={value}>{value}</option>)}
            </select></Field>
            <Field label="Billing Cycle"><select required className={field} value={cycle} onChange={event => setDraft({ ...draft, options: { ...draft.options, Billing_Cycle: event.target.value } })}>
              <option value="">Select billing cycle</option><option>Monthly</option><option>Annual</option>
            </select></Field>
          </div>
          {template && addon?.Currency_code && template.Currency.split(' ')[0] !== addon.Currency_code && (
            <p className="text-sm text-muted-foreground">Enter the base price in {template.Currency}. Saving updates the amount and currency in Add-on Master.</p>
          )}
          <Field label={'Base price' + (template ? ' (' + template.Currency + ')' : '')}><Input required type="number" min="0" step="0.01" value={amount} onChange={event => setDraft({ ...draft, amount: event.target.value })} /></Field>
          <details className="text-sm"><summary className="cursor-pointer text-muted-foreground">Effective dates</summary>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Field label="Effective from"><Input type="date" value={draft.from} onChange={event => setDraft({ ...draft, from: event.target.value })} /></Field>
            <Field label="Effective to"><Input type="date" min={draft.from || undefined} value={draft.to} onChange={event => setDraft({ ...draft, to: event.target.value })} /></Field>
          </div></details>
          {template && <section className="space-y-2" aria-label="Editable pricing rule tiers">
            {templateDetails.isError ? (
              <p role="alert" className="text-sm text-destructive">Could not load pricing tiers. <button type="button" className="underline" onClick={() => void templateDetails.refetch()}>Retry</button></p>
            ) : !templateDetails.currentData ? (
              <p role="status" className="text-sm text-muted-foreground">Loading pricing tiers...</p>
            ) : <>
              <TierFields template tiers={tiers} currency={template.Currency} change={rows => setDraft({ ...draft, tiers: rows })} />
              {!!templateDetails.currentData.Tiers?.length && <Button type="button" variant="outline" size="sm"
                onClick={() => setDraft({ ...draft, tiers: (templateDetails.currentData?.Tiers ?? []).map(tierDraft) })}>Load Template Tiers</Button>}
            </>}
          </section>}
          {addon && !!addon.plans_details?.length && <details className="space-y-2 rounded-xl border p-3">
            <summary className="cursor-pointer text-sm font-semibold">Plan-specific rates ({addon.plans_details.length})</summary>
            <p className="text-xs text-muted-foreground">Set a separate rate and trial period for each linked subscription plan{template ? ' in ' + template.Currency : ''}.</p>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60"><tr>{['Plan Tier', 'Rate', 'Trial Days', 'Active'].map(label => <th key={label} className="p-2">{label}</th>)}</tr></thead>
                <tbody className="divide-y">
                  {addon.plans_details?.map(plan => {
                    const saved = draft.options.Edition_Rates ?? [];
                    const current = saved.find(row => row.Plan === plan.id) ?? { Plan: plan.id, Rate: '', Trial_Days: addon.Trial_Days ?? 0, Active: false };
                    const change = (values: Partial<typeof current>) => {
                      const next = { ...current, ...values };
                      const rows = saved.filter(row => row.Plan !== plan.id);
                      setDraft({ ...draft, options: { ...draft.options, Edition_Rates: [...rows, next] } });
                    };
                    return <tr key={plan.id}>
                      <td className="p-2">{plan.Plan_Name}</td>
                      <td className="p-2"><Input aria-label={plan.Plan_Name + ' rate'} className="h-8" type="number" min="0" step="0.01" required={current.Active} value={current.Rate} onChange={event => change({ Rate: event.target.value })} /></td>
                      <td className="p-2"><Input aria-label={plan.Plan_Name + ' trial days'} className="h-8" type="number" min="0" value={current.Trial_Days} onChange={event => change({ Trial_Days: Number(event.target.value) })} /></td>
                      <td className="p-2"><input type="checkbox" role="switch" className={planSwitch} aria-label={plan.Plan_Name + ' active'} checked={current.Active} onChange={event => change({ Active: event.target.checked })} /></td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          </details>}
          <div className="grid gap-2 rounded-lg border p-3 text-sm">
            <h3 className="rounded bg-violet-100/70 px-2 py-1 font-semibold dark:bg-violet-950/40">Additional Settings</h3>
            <label className="flex gap-2"><input type="checkbox" checked={draft.options.Allow_Annual_Billing ?? false} onChange={event => setDraft({ ...draft, options: { ...draft.options, Allow_Annual_Billing: event.target.checked } })} />Allow annual billing (with discount)</label>
            {draft.options.Allow_Annual_Billing && <Field label="Annual Discount (%)"><Input type="number" min="0" max="100" step="0.01" value={draft.options.Annual_Discount ?? ''} onChange={event => setDraft({ ...draft, options: { ...draft.options, Annual_Discount: event.target.value || null } })} /></Field>}
            <label className="flex gap-2"><input type="checkbox" checked={draft.options.Require_Approval ?? false} onChange={event => setDraft({ ...draft, options: { ...draft.options, Require_Approval: event.target.checked } })} />Require approval for activation</label>
            <label className="flex gap-2"><input type="checkbox" checked={draft.options.Marketplace_Visible ?? Boolean(addon?.Is_Active)} onChange={event => setDraft({ ...draft, options: { ...draft.options, Marketplace_Visible: event.target.checked } })} />Show in Add-on Marketplace</label>
            <label className="flex gap-2"><input type="checkbox" checked={draft.options.Allow_Trial ?? Boolean(addon?.Trial_Available)} onChange={event => setDraft({ ...draft, options: { ...draft.options, Allow_Trial: event.target.checked } })} />Allow trial for new customers</label>
          </div>
          </div>
          {tab === 'Discounts & Offers' && template?.Discount_Percentage != null && <p className="text-sm text-muted-foreground">Template discount: {template.Discount_Percentage}%</p>}
          {tab === 'Discounts & Offers' && <Field label="Annual discount (%)"><Input type="number" min="0" max="100" step="0.01" value={draft.options.Annual_Discount ?? ''} onChange={event => setDraft({ ...draft, options: { ...draft.options, Annual_Discount: event.target.value || null } })} /></Field>}
          {error && <p className="break-words text-sm text-destructive" role="alert">{error}</p>}
          <EditorActions busy={busy} disabled={!addon || !template || (changedTemplate && !templateDetails.currentData)} onCancel={() => open()} saveLabel={draft.id ? 'Update Pricing' : 'Save Pricing'}
            onDelete={draft.id ? () => void deletePricing(draft.id!) : undefined} />
        </fieldset>
      </form>
    </PricingWorkspace>
    <Dialog open={overview !== null} onOpenChange={open => { if (!open) setOverview(null); }}>
      {overview && <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{addons.data?.find(item => item.id === overview.Addon)?.Addon_Name || overview.Addon_Name || 'Add-on Pricing'}</DialogTitle>
          <DialogDescription>Pricing rule overview</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-2 gap-3 rounded-lg border p-3 text-sm">
          <div><dt className="text-muted-foreground">Price template</dt><dd>{overview.Price_Template_Name}</dd></div>
          <div><dt className="text-muted-foreground">Pricing model</dt><dd>{modelFor(overview)}</dd></div>
          <div><dt className="text-muted-foreground">Billing cycle</dt><dd>{overview.Pricing_Options?.Billing_Cycle || overview.Billing_Cycle}</dd></div>
          <div><dt className="text-muted-foreground">Base price</dt><dd><Money amount={overview.Base_Price} currency={overview.Currency} /></dd></div>
          <div><dt className="text-muted-foreground">Status</dt><dd><Status active={overview.Is_Active} /></dd></div>
          <div><dt className="text-muted-foreground">Plan rates</dt><dd>{overview.Pricing_Options?.Edition_Rates?.length ?? 0}</dd></div>
        </dl>
        <Button type="button" variant="outline" className="justify-self-end" onClick={() => setOverview(null)}>Close</Button>
      </DialogContent>}
    </Dialog>
  </>;
}
