'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { AddonPricingDto, TierScheduleDetails } from '@/service/api/addonPricingApi';
import { Button } from '@/components/ui/button';
import { useGetAddonPricingWithoutPaginationQuery } from '@/service/api/addonPricingApi';
import { useGetAddonPriceTemplatesWithoutPaginationQuery } from '@/service/api/addonPriceTemplateApi';
import { useSaveAddonTierScheduleMutation } from '@/service/api/addonTieredPricingApi';
import { useGetMarketplaceAddonsQuery } from '@/service/api/marketplaceAddonApi';
import { apiError, EditorActions, EditorTabs, Field, field, isActiveSubmit, Money, PricingWorkspace, Status, tierDraft, TierFields, tierPayload, type TierDraft } from '../PricingWorkspace';

type Draft = { addon: number; pricing: number; template: number; details: TierScheduleDetails; tiers: TierDraft[] };
const blankDetails = { Code: '', Name: '', Billing_Cycle: '', Method: 'Volume Based', Usage_Metric: 'Users' };
const blank: Draft = { addon: 0, pricing: 0, template: 0, details: blankDetails, tiers: [] };

export function TieredPricingScreen() {
  const pricingList = useGetAddonPricingWithoutPaginationQuery(undefined, { refetchOnMountOrArgChange: true });
  const templateList = useGetAddonPriceTemplatesWithoutPaginationQuery(undefined, { refetchOnMountOrArgChange: true });
  const addonList = useGetMarketplaceAddonsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [saveSchedule, saving] = useSaveAddonTierScheduleMutation();
  const [tab, setTab] = useState('Tier Configuration');
  const [draft, setDraft] = useState<Draft>(blank);
  const [overview, setOverview] = useState<AddonPricingDto | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const rules = pricingList.data ?? [];
  const template = templateList.data?.find(item => item.id === draft?.template);
  const tierGroups = new Map(rules.flatMap(rule => rule.Tiers?.length ? [[rule.id, rule.Tiers] as const] : []));
  const schedules = rules.filter(rule => tierGroups.has(rule.id));
  const discounts = [...tierGroups.values()].flat().flatMap(row => row.Discount == null ? [] : [Number(row.Discount)]);
  const averageDiscount = discounts.length ? (discounts.reduce((sum, value) => sum + value, 0) / discounts.length).toFixed(1) + '%' : '—';
  const availableRules = rules.filter(rule => rule.Addon === draft?.addon);
  const queries = [pricingList, templateList, addonList];
  const loading = queries.some(query => query.isLoading);
  const failed = queries.some(query => query.isError);

  function chooseRule(id: number, addon: number) {
    if (saving.isLoading || (id && draft.pricing === id)) return;
    setError('');
    const rule = rules.find(item => item.id === id && item.Addon === addon);
    const assigned = templateList.data?.find(item => item.id === rule?.Price_Template);
    const existing = tierGroups.get(id);
    const tiers = existing
      ? [...existing].sort((left, right) => left.Min_Employees - right.Min_Employees).map((row, index) => tierDraft({ ...row, Name: row.Name || 'Tier ' + (index + 1) }))
      : (rule?.Tier_Schedule?.Customized ? [] : (assigned?.Tiers ?? [])).map(tierDraft);
    const cycle = (rule?.Pricing_Options?.Billing_Cycle || assigned?.Billing_Cycle)?.toLowerCase();
    setDraft({
      addon, pricing: id, template: rule?.Price_Template ?? 0, tiers, details: {
        ...blankDetails, Code: draft?.pricing && tierGroups.has(draft.pricing) ? '' : draft?.details.Code ?? '',
        Name: draft?.pricing && tierGroups.has(draft.pricing) ? '' : draft?.details.Name ?? '',
        Billing_Cycle: cycle === 'annual' ? 'Annual' : cycle === 'monthly' ? 'Monthly' : '',
        ...(existing ? { Code: rule?.AddonPricing_Id ?? '', Name: rule?.Addon_Name ?? '', ...rule?.Tier_Schedule } : {}),
      }
    });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft?.tiers.length) return;
    await persist(isActiveSubmit(event.nativeEvent as SubmitEvent));
  }

  async function persist(active: boolean) {
    if (!draft?.pricing || !draft.template || saving.isLoading) return;
    setError('');
    try {
      await saveSchedule({
        Addon_Pricing: draft.pricing, Price_Template: draft.template,
        Is_Active: active, Schedule: draft.details, Tiers: tierPayload(draft.tiers),
      }).unwrap();
      setDraft(blank);
      setTab('Tier Configuration');
      setNotice('Tier schedule saved.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  async function deleteSchedule(rule: AddonPricingDto) {
    if (saving.isLoading || !window.confirm('Delete this tier schedule?')) return;
    setError('');
    setNotice('');
    try {
      await saveSchedule({ Addon_Pricing: rule.id, Price_Template: rule.Price_Template, Is_Active: false, Tiers: [] }).unwrap();
      if (draft.pricing === rule.id) { setDraft(blank); setTab('Tier Configuration'); }
      setNotice('Tier schedule deleted.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  return <>
    {notice && <p className="mb-3 text-sm text-emerald-700" role="status">{notice}</p>}
    <PricingWorkspace title="Tiered Pricing" description="Create a schedule from the template assigned to a saved add-on pricing rule."
      createLabel="Create Tiered Pricing" onCreate={() => { setDraft(blank); setTab('Tier Configuration'); setError(''); setNotice(''); }} pending={loading} failed={failed}
      retry={() => queries.forEach(query => void query.refetch())}
      selectedId={draft?.pricing}
      editorStatus={draft && tierGroups.has(draft.pricing) ? tierGroups.get(draft.pricing)?.some(tier => tier.Is_Active) : undefined}
      editorTitle={tierGroups.has(draft.pricing) ? 'Edit Tiered Pricing' : 'Create Tiered Pricing'}
      metrics={[
        ['Total Tiered Plans', schedules.length],
        ['Active Plans', schedules.filter(rule => tierGroups.get(rule.id)?.some(tier => tier.Is_Active)).length],
        ['Add-ons with Tiers', new Set(schedules.map(rule => rule.Addon)).size],
        ['Avg. Volume Discount', averageDiscount],
      ]}
      filterLabels={['Product', 'Add-on']}
      columns={['Plan Code', 'Plan Name', 'Add-on', 'Billing Cycle', 'Tiers', 'Status']}
      rows={schedules.map(rule => {
        const group = tierGroups.get(rule.id) ?? [];
        const active = group.some(tier => tier.Is_Active);
        const assigned = templateList.data?.find(item => item.id === rule.Price_Template);
        const master = addonList.data?.find(item => item.id === rule.Addon);
        const values = [rule.Tier_Schedule?.Code || rule.AddonPricing_Id, rule.Tier_Schedule?.Name || rule.Addon_Name || '', master?.Addon_Name || rule.Addon_Name || '', rule.Tier_Schedule?.Billing_Cycle || assigned?.Billing_Cycle || rule.Billing_Cycle || '', group.length] as const;
        return {
          id: rule.id, filters: { 'Add-on': values[2], Product: master?.products_details?.map(product => product.Product_Name) ?? [] }, search: values.join(' '), active, cells: [<button type="button" className="font-semibold text-violet-700 underline" onClick={() => chooseRule(rule.id, rule.Addon)}>{values[0]}</button>, ...values.slice(1), <Status active={active} />],
          exportValues: [...values, active ? 'Active' : 'Draft'], edit: () => { setTab('Tier Configuration'); setNotice(''); chooseRule(rule.id, rule.Addon); },
          actions: <DropdownMenu modal={false}>
            <DropdownMenuTrigger type="button" disabled={saving.isLoading} aria-label={'Actions for ' + values[0]}
              className="rounded p-1 text-violet-700 hover:bg-violet-100"><MoreVertical aria-hidden className="size-4" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOverview(rule)}><Eye /> Overview</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setTab('Tier Configuration'); chooseRule(rule.id, rule.Addon); }}><Pencil /> Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => void deleteSchedule(rule)}><Trash2 /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>,
        };
      })}>
      <form className="p-4" onSubmit={save}>
        <fieldset className="min-w-0 space-y-4" disabled={saving.isLoading || loading || failed}>
          <EditorTabs tabs={['Basic Details', 'Tier Configuration', 'Applicability', 'Advanced']} value={tab} change={setTab} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Plan Code"><Input required maxLength={50} value={draft.details.Code} onChange={event => setDraft({ ...draft, details: { ...draft.details, Code: event.target.value } })} /></Field>
            <Field label="Plan Name"><Input required maxLength={150} value={draft.details.Name} onChange={event => setDraft({ ...draft, details: { ...draft.details, Name: event.target.value } })} /></Field>
            <Field label="Add-on"><select className={field} required value={draft.addon || ''} onChange={event => {
              const addon = Number(event.target.value);
              const matches = rules.filter(rule => rule.Addon === addon);
              chooseRule(matches.length === 1 ? matches[0].id : 0, addon);
            }}>
              <option value="">Select add-on</option>
              {addonList.data?.filter(item => rules.some(rule => rule.Addon === item.id)).map(item => <option key={item.id} value={item.id}>{item.Addon_Name}</option>)}
            </select></Field>
            <Field label="Billing Cycle"><select className={field} required value={draft.details.Billing_Cycle} onChange={event => setDraft({ ...draft, details: { ...draft.details, Billing_Cycle: event.target.value } })}>
              <option value="">Select billing cycle</option><option>Monthly</option><option>Annual</option>
            </select></Field>
            {availableRules.length > 1 && <Field label="Saved pricing rule"><select className={field} required value={draft.pricing || ''} onChange={event => chooseRule(Number(event.target.value), draft.addon)}>
              <option value="">Select pricing rule</option>
              {availableRules.map(rule => <option key={rule.id} value={rule.id}>{rule.Price_Template_Name || rule.Template_Code} ({rule.AddonPricing_Id}){rule.Tiers?.length ? ' - ' + rule.Tiers.length + ' saved tiers' : ''}</option>)}
            </select></Field>}
          </div>
          {!rules.length && !loading && <p className="text-sm text-muted-foreground">Save a pricing rule in Add-on Pricing to configure its tiers.</p>}
          {draft.pricing > 0 && !template && <p role="alert" className="text-sm text-destructive">The assigned price template is unavailable.</p>}
          {tab === 'Advanced' && <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Pricing Method"><select className={field} value={draft.details.Method} onChange={event => setDraft({ ...draft, details: { ...draft.details, Method: event.target.value } })}><option>Volume Based</option><option>Graduated (Tiered)</option></select></Field>
            <Field label="Usage Metric"><Input required maxLength={80} value={draft.details.Usage_Metric} onChange={event => setDraft({ ...draft, details: { ...draft.details, Usage_Metric: event.target.value } })} /></Field>
          </div>}
          {template && (tab === 'Tier Configuration' || tab === 'Applicability') && <>
            <div className="rounded-xl bg-muted/60 p-3 text-sm">
              <p className="font-medium">{template.Template_Name} ({template.Template_Code})</p>
              <p className="text-muted-foreground">{[template.Billing_Cycle, template.Currency].filter(Boolean).join(' · ')}</p>
            </div>
            {!!template.Tiers?.length && (
              <Button type="button" variant="outline" size="sm" onClick={() => setDraft({ ...draft, tiers: (template.Tiers ?? []).map(tierDraft) })}>Load Template Tiers</Button>
            )}
            {tab === 'Tier Configuration' && <TierFields metric={draft.details.Usage_Metric} tiers={draft.tiers} change={tiers => setDraft({ ...draft, tiers })} currency={template.Currency} />}
            {tab === 'Tier Configuration' && !!draft.tiers.length && draft.tiers[0].Tier_Price && <p className="rounded-xl border border-violet-100 bg-violet-50 p-3 text-xs text-slate-700 dark:bg-violet-950/40 dark:text-slate-200">The first tier covers {draft.tiers[0].Min_Employees || '—'} to {draft.tiers[0].Max_Employees || '—'} {draft.details.Usage_Metric.toLowerCase()} at {draft.tiers[0].Tier_Price} {template.Currency}.</p>}
          </>}
          {error && <p className="break-words text-sm text-destructive" role="alert">{error}</p>}
          <EditorActions busy={saving.isLoading} disabled={!template || !draft.tiers.length} onCancel={() => { setDraft(blank); setTab('Tier Configuration'); setError(''); }} saveLabel={tierGroups.has(draft.pricing) ? 'Update Tiered Pricing' : 'Save Tiered Pricing'}
          />
        </fieldset>
      </form>
    </PricingWorkspace>
    <Dialog open={overview !== null} onOpenChange={open => { if (!open) setOverview(null); }}>
      {overview && <DialogContent className="max-w-2xl">
        <DialogHeader className="pr-8">
          <DialogTitle>{overview.Tier_Schedule?.Name || overview.Addon_Name || 'Tiered Pricing'}</DialogTitle>
          <DialogDescription>{overview.Tier_Schedule?.Code || overview.AddonPricing_Id} / {overview.Price_Template_Name}</DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-violet-50 dark:bg-violet-950/40"><tr>{['Tier', 'Usage range', 'Unit price', 'Effective price', 'Discount'].map(label => <th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead>
            <tbody className="divide-y">{overview.Tiers?.map(tier => <tr key={tier.id ?? tier.Min_Employees}>
              <th scope="row" className="p-2 font-medium">{tier.Name}</th>
              <td className="p-2">{tier.Min_Employees} - {tier.Max_Employees}</td>
              <td className="p-2">{tier.Unit_Price ?? '—'}</td>
              <td className="p-2"><Money amount={tier.Tier_Price} currency={overview.Currency} /></td>
              <td className="p-2">{tier.Discount == null ? '—' : tier.Discount + '%'}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <Button type="button" variant="outline" className="justify-self-end" onClick={() => setOverview(null)}>Close</Button>
      </DialogContent>}
    </Dialog>
  </>;
}
