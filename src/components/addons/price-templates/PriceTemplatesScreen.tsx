'use client';

import { useState, type FormEvent } from 'react';
import { Eye, Layers, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useCreateAddonPriceTemplateMutation, useDeleteAddonPriceTemplateMutation,
  useGetPriceTemplateListQuery, useUpdateAddonPriceTemplateMutation,
  type AddonPriceTemplateDto,
} from '@/service/api/addonPriceTemplateApi';
import { apiError, EditorActions, EditorTabs, Field, field, isActiveSubmit, Money, PricingWorkspace, Status, tierDraft, TierFields, tierPayload, type TierDraft } from '../PricingWorkspace';

type TemplateDraft = {
  id?: number; code: string; name: string; type: string; cycle: string; currency: string;
  description: string; discount: string; tiers: TierDraft[]; show: boolean; customize: boolean; applied: number;
};

const blank: TemplateDraft = {
  code: '', name: '', type: '', cycle: '', currency: '', description: '', discount: '', tiers: [],
  show: false, customize: false, applied: 0,
};
const switchClass = 'relative h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-slate-300 transition-colors before:absolute before:left-0.5 before:top-0.5 before:size-4 before:rounded-full before:bg-white before:shadow-sm before:transition-transform checked:bg-violet-700 checked:before:translate-x-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700';
const currencies = ['INR', 'USD', 'EUR'];
const currencyCode = (code: string) => code.split(' ')[0];

export function PriceTemplatesScreen() {
  const list = useGetPriceTemplateListQuery(undefined, { refetchOnMountOrArgChange: true });
  const [create, creating] = useCreateAddonPriceTemplateMutation();
  const [update, updating] = useUpdateAddonPriceTemplateMutation();
  const [remove, deleting] = useDeleteAddonPriceTemplateMutation();
  const [tab, setTab] = useState('Basic Details');
  const [overview, setOverview] = useState<AddonPriceTemplateDto | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [draft, setDraft] = useState<TemplateDraft>(blank);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const busy = creating.isLoading || updating.isLoading || deleting.isLoading;
  const templates = list.data ?? [];
  const discounts = templates.flatMap(template => template.Discount_Percentage == null ? [] : [Number(template.Discount_Percentage)]);

  function open(template?: AddonPriceTemplateDto) {
    if (busy || (template && draft.id === template.id)) return;
    setTab('Basic Details');
    setError('');
    setNotice('');
    setDraft(template ? {
      id: template.id, code: template.Template_Code, name: template.Template_Name,
      type: template.Billing_Type ?? '', cycle: template.Billing_Cycle ?? '',
      currency: currencyCode(template.Currency), description: template.Description ?? '',
      discount: template.Discount_Percentage ?? '',
      tiers: (template.Tiers ?? []).map(tierDraft), show: template.Show_For_New_Addons ?? false,
      customize: template.Allow_Customization ?? false, applied: template.Applied_Addons?.length ?? 0,
    } : blank);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError('');
    const payload = {
      Template_Code: draft.code.trim(), Template_Name: draft.name.trim(),
      Billing_Type: draft.type, Billing_Cycle: draft.cycle, Currency: draft.currency,
      Description: draft.description, Discount_Percentage: draft.discount || null, Tiers: tierPayload(draft.tiers, true), Show_For_New_Addons: draft.show,
      Allow_Customization: draft.customize, Is_Active: isActiveSubmit(event.nativeEvent as SubmitEvent),
    };
    try {
      await (draft.id ? update({ id: draft.id, ...payload }) : create(payload)).unwrap();
      setDraft(blank);
      setTab('Basic Details');
      setNotice('Price template saved.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  async function deleteTemplate(id: number) {
    if (!window.confirm('Delete this price template?')) return;
    setDeleteError('');
    setNotice('');
    try {
      await remove(id).unwrap();
      if (draft.id === id) {
        setDraft(blank);
        setTab('Basic Details');
        setError('');
      }
      setNotice('Price template deleted.');
    } catch (failure) {
      setDeleteError(apiError(failure));
    }
  }

  return <>
    {notice && <p className="mb-3 text-sm text-emerald-700" role="status">{notice}</p>}
    {deleteError && <p role="alert" className="mb-3 text-sm text-destructive">{deleteError}</p>}
    <PricingWorkspace title="Price Templates" description="Create reusable billing details and employee pricing tiers."
      createLabel="Create Price Template" onCreate={() => open()} pending={list.isLoading} failed={list.isError} retry={list.refetch}
      selectedId={draft.id}
      editorStatus={templates.find(item => item.id === draft.id)?.Is_Active}
      editorTitle={draft.id ? 'Edit Price Template' : 'Create Price Template'}
      metrics={[
        ['Total Templates', templates.length],
        ['Active Templates', templates.filter(template => template.Is_Active).length],
        ['Applied Add-ons', new Set(templates.flatMap(template => template.Applied_Addons ?? [])).size],
        ['Avg. Discount', discounts.length ? (discounts.reduce((sum, value) => sum + value, 0) / discounts.length).toFixed(1) + '%' : '—'],
      ]}
      filterLabels={["Template Type", "Billing Cycle"]}
      columns={['Template Code', 'Template Name', 'Type', 'Billing Cycle', 'Currency', 'Tiers', 'Applied Add-ons', 'Status']}
      rows={templates.map(template => {
        const values = [template.Template_Code, template.Template_Name, template.Billing_Type ?? '', template.Billing_Cycle ?? '', currencyCode(template.Currency), template.Tiers?.length ?? 0, template.Applied_Addons?.length ?? 0];
        return {
          id: template.id, filters: { 'Template Type': template.Billing_Type ?? '', 'Billing Cycle': template.Billing_Cycle ?? '' }, search: values.join(' '), active: template.Is_Active,
          cells: [<button type="button" className="font-semibold text-violet-700 underline" onClick={() => open(template)}>{values[0]}</button>, ...values.slice(1), <Status active={template.Is_Active} />], exportValues: [...values, template.Is_Active ? 'Active' : 'Draft'], edit: () => open(template),
          actions: <DropdownMenu modal={false}>
            <DropdownMenuTrigger type="button" disabled={busy} aria-label={'Actions for ' + template.Template_Code}
              className="rounded p-1 text-violet-700 hover:bg-violet-100 dark:text-violet-300 dark:hover:bg-violet-900">
              <MoreVertical aria-hidden className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOverview(template)}><Eye /> Overview</DropdownMenuItem>
              <DropdownMenuItem onClick={() => open(template)}><Pencil /> Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" disabled={!!template.Applied_Addons?.length} onClick={() => void deleteTemplate(template.id)}><Trash2 /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>,
        };
      })}>
      <form className="p-4" onSubmit={save} onInvalidCapture={() => setTab('Basic Details')}>
        <fieldset className="min-w-0 space-y-4" disabled={busy}>
          <EditorTabs tabs={['Basic Details', 'Tiered Pricing', 'Discounts', 'Applicability']} value={tab} change={setTab} />
          <div hidden={tab !== 'Basic Details'}><div className="grid gap-3 sm:grid-cols-2">
            <Field label="Template code"><Input required maxLength={50} value={draft.code} onChange={event => setDraft({ ...draft, code: event.target.value })} /></Field>
            <Field label="Template name"><Input required maxLength={150} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></Field>
            <Field label="Template type"><select required className={field} value={draft.type} onChange={event => setDraft({ ...draft, type: event.target.value })}>
              <option value="">Select template type</option>{[...new Set(['Subscription', 'Usage', 'Hybrid', draft.type])].filter(Boolean).map(value => <option key={value}>{value}</option>)}
            </select></Field>
            <Field label="Billing cycle"><select required className={field} value={draft.cycle} onChange={event => setDraft({ ...draft, cycle: event.target.value })}>
              <option value="">Select billing cycle</option>{[...new Set(['Monthly', 'Annual', draft.cycle])].filter(Boolean).map(value => <option key={value}>{value}</option>)}
            </select></Field>
            <Field label="Currency"><select required className={field} value={draft.currency} onChange={event => setDraft({ ...draft, currency: event.target.value })}>
              <option value="">Select currency</option>{[...new Set([...currencies, draft.currency])].filter(Boolean).map(value => <option key={value}>{value}</option>)}
            </select></Field>
          </div></div>
          <div hidden={tab !== 'Basic Details'}><Field label="Description"><textarea rows={3} className={field + ' h-auto py-2'} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} /></Field></div>
          <div hidden={tab !== 'Discounts'}><Field label="Template discount (%)"><Input type="number" min="0" max="100" step="0.01" value={draft.discount} onChange={event => setDraft({ ...draft, discount: event.target.value })} /></Field></div>
          <div hidden={tab !== 'Basic Details' && tab !== 'Tiered Pricing'}><TierFields template tiers={draft.tiers} currency={draft.currency} change={tiers => setDraft({ ...draft, tiers })} /></div>
          <div hidden={tab !== 'Basic Details' && tab !== 'Applicability'}><div className="grid gap-2 border-t pt-4 text-sm">
            <label className="flex gap-2"><input type="checkbox" role="switch" className={switchClass} checked={draft.show} onChange={event => setDraft({ ...draft, show: event.target.checked })} />Show this template for new add-ons</label>
            <label className="flex gap-2"><input type="checkbox" role="switch" className={switchClass} checked={draft.customize} onChange={event => setDraft({ ...draft, customize: event.target.checked })} />Allow customization at add-on level</label>
            {!!draft.id && <p className="text-muted-foreground">Applied to {draft.applied} add-ons</p>}
          </div></div>
          {error && <p className="break-words text-sm text-destructive" role="alert">{error}</p>}
          <EditorActions busy={busy} onCancel={() => open()} saveLabel="Save Template"
            onDelete={draft.id && !draft.applied ? () => void deleteTemplate(draft.id!) : undefined} />
        </fieldset>
      </form>
    </PricingWorkspace>
    <Dialog open={overview !== null} onOpenChange={open => { if (!open) setOverview(null); }}>
      {overview && <DialogContent className="w-[calc(100%-2rem)] max-w-2xl gap-0 overflow-x-hidden p-0">
        <DialogHeader className="border-b bg-violet-50 px-5 py-4 pr-14 dark:bg-violet-950/40">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200">
              <Layers aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="break-words text-lg font-semibold">{overview.Template_Name}</DialogTitle>
              <DialogDescription>Template code {overview.Template_Code}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="min-w-0 space-y-5 p-5">
          <section aria-label="Template details">
            <dl className="grid gap-3 rounded-xl border bg-muted/30 p-4 text-sm sm:grid-cols-3">
              <div><dt className="text-muted-foreground">Template type</dt><dd className="font-medium">{overview.Billing_Type || '—'}</dd></div>
              <div><dt className="text-muted-foreground">Billing cycle</dt><dd className="font-medium">{overview.Billing_Cycle || '—'}</dd></div>
              <div><dt className="text-muted-foreground">Currency</dt><dd className="font-medium">{overview.Currency}</dd></div>
              <div><dt className="mb-1 text-muted-foreground">Status</dt><dd><Status active={overview.Is_Active} /></dd></div>
              <div><dt className="text-muted-foreground">Discount</dt><dd className="font-medium">{overview.Discount_Percentage == null ? '—' : overview.Discount_Percentage + '%'}</dd></div>
              <div><dt className="text-muted-foreground">Applied add-ons</dt><dd className="font-medium">{overview.Applied_Addons?.length ?? 0}</dd></div>
              {overview.Description && <div className="border-t pt-3 sm:col-span-3"><dt className="text-muted-foreground">Description</dt><dd className="whitespace-pre-wrap break-words">{overview.Description}</dd></div>}
            </dl>
          </section>
          <section aria-label="Tiered pricing" className="space-y-2">
            <h3 className="font-semibold">Tiered Pricing</h3>
            {overview.Tiers?.length ? <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted"><tr>{['Tier', 'Price', 'User limit', 'Storage', 'Features'].map(label => <th key={label} scope="col" className="px-3 py-2 font-medium">{label}</th>)}</tr></thead>
                <tbody className="divide-y">{overview.Tiers.map((tier, index) => <tr key={index}>
                  <th scope="row" className="px-3 py-2 text-left font-medium">{tier.Name}</th>
                  <td className="whitespace-nowrap px-3 py-2"><Money amount={tier.Tier_Price} currency={overview.Currency} /></td>
                  <td className="px-3 py-2">{tier.Max_Employees}</td>
                  <td className="px-3 py-2">{tier.Storage || '—'}</td>
                  <td className="px-3 py-2">{tier.Features || '—'}</td>
                </tr>)}</tbody>
              </table>
            </div> : <p className="rounded-lg border p-3 text-muted-foreground">No tiers configured.</p>}
          </section>
          <dl aria-label="Applicability" className="grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
            <div><dt className="text-muted-foreground">Show for new add-ons</dt><dd className="font-medium">{overview.Show_For_New_Addons ? 'Yes' : 'No'}</dd></div>
            <div><dt className="text-muted-foreground">Allow add-on customization</dt><dd className="font-medium">{overview.Allow_Customization ? 'Yes' : 'No'}</dd></div>
          </dl>
        </div>
        <div className="flex justify-end border-t px-5 py-3">
          <Button type="button" variant="outline" onClick={() => setOverview(null)}>Close</Button>
        </div>
      </DialogContent>}
    </Dialog>
  </>;
}
