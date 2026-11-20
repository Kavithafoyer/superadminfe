'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  PackagePlus,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  Save,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetAddonMasterListQuery,
  useCreateAddonMasterMutation,
  useUpdateAddonMasterMutation,
  useDeleteAddonMasterMutation,
  AddonMasterRecord,
} from '@/service/api/superAdminService';

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD'];
const AVAILABLE_TAGS = ['Popular', 'AI Module', 'Storage Boost', 'Seat Pack', 'Enterprise Security', 'Custom Integration'];

export default function AddonMasterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: addonsList = [], isLoading, refetch, isFetching } = useGetAddonMasterListQuery();
  const [createAddon, { isLoading: isCreating }] = useCreateAddonMasterMutation();
  const [updateAddon, { isLoading: isUpdating }] = useUpdateAddonMasterMutation();
  const [deleteAddon, { isLoading: isDeleting }] = useDeleteAddonMasterMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals & Selection
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonMasterRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State - strictly blank initial state (NO static fallback)
  const initialForm = {
    Addon_Name: '',
    Price: '',
    NoofUsers: '',
    Currency_code: 'USD',
    Country: 'United States',
    Started_Date: '',
    Is_Active: true,
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  // Filtered List
  const filteredList = useMemo(() => {
    return addonsList.filter((a) => {
      const s = searchTerm.toLowerCase();
      return (
        (a.Addon_Name || '').toLowerCase().includes(s) ||
        (a.Addon_Id || '').toLowerCase().includes(s) ||
        (a.Country || '').toLowerCase().includes(s)
      );
    });
  }, [addonsList, searchTerm]);

  // Clean Pagination (no rows per page dropdown)
  const totalItems = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  // Auto-populate formData when directly visiting or refreshing on an edit page (/settings/addons/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && addonsList.length > 0) {
      const a = addonsList.find((item: any) => String(item.id) === String(routeEditId) || String(item.Addon_Id) === String(routeEditId));
      if (a && (!editingAddon || String(editingAddon.id) !== String(a.id))) {
        setEditingAddon(a);
        setFormData({
          Addon_Name: a.Addon_Name || '',
          Price: String(a.Price || ''),
          NoofUsers: String(a.NoofUsers || ''),
          Currency_code: a.Currency_code || 'USD',
          Country: a.Country || 'United States',
          Started_Date: a.Started_Date ? a.Started_Date.split('T')[0] : '',
          Is_Active: a.Is_Active !== false,
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, addonsList, editingAddon]);

  const handleOpenCreate = () => {
    setEditingAddon(null);
    setFormData(initialForm);
    setInternalViewMode('create');
    router.push('/settings/addons/create');
  };

  const handleOpenEdit = (a: AddonMasterRecord) => {
    setEditingAddon(a);
    setFormData({
      Addon_Name: a.Addon_Name || '',
      Price: String(a.Price || ''),
      NoofUsers: String(a.NoofUsers || ''),
      Currency_code: a.Currency_code || 'USD',
      Country: a.Country || 'United States',
      Started_Date: a.Started_Date ? a.Started_Date.split('T')[0] : '',
      Is_Active: a.Is_Active !== false,
      selectedTags: [],
      notes: '',
    });
    setInternalViewMode('edit');
    router.push(`/settings/addons/edit/${a.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/settings/addons');
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Addon_Name.trim() || !formData.Price) {
      toast.error('Addon Name and Price are required');
      return;
    }

    try {
      const payload: Partial<AddonMasterRecord> = {
        Addon_Name: formData.Addon_Name.trim(),
        Price: Number(formData.Price),
        NoofUsers: formData.NoofUsers ? Number(formData.NoofUsers) : undefined,
        Currency_code: formData.Currency_code,
        Country: formData.Country.trim(),
        Started_Date: formData.Started_Date || undefined,
        Is_Active: formData.Is_Active,
      };

      if (viewMode === 'edit' && editingAddon) {
        await updateAddon({ id: editingAddon.id, ...payload }).unwrap();
        toast.success('Addon package updated successfully');
      } else {
        await createAddon(payload).unwrap();
        toast.success('Addon package created successfully');
      }
      handleBackToList();
      refetch();
    } catch {
      toast.error('Failed to save addon package');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteAddon({ id: deletingId }).unwrap();
      toast.success('Addon package deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      refetch();
    } catch {
      toast.error('Failed to delete addon package');
    }
  };

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE / EDIT VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Top Header Bar matching CBS Pegatto */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleBackToList}
              className="h-9 w-9 rounded-full border border-border bg-background hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Link href="/settings" className="hover:underline">
                  Settings
                </Link>
                <span>/</span>
                <span className="hover:underline cursor-pointer" onClick={handleBackToList}>
                  Addon Master
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Addon Package' : 'Create Addon Package'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Addon: ${formData.Addon_Name || 'Selected Package'}` : 'Create Addon Package'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToList}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-5"
            >
              <Save className="h-4 w-4" />
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Addon'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: ADDON SPECIFICATIONS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ADDON SPECIFICATIONS & PRICING
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Addon_Name" className="text-xs font-semibold uppercase tracking-wider">
                      ADDON PACKAGE NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Addon_Name"
                      placeholder="e.g. AI Predictive Telemetry & Automation Hub"
                      value={formData.Addon_Name}
                      onChange={(e) => setFormData({ ...formData, Addon_Name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Price" className="text-xs font-semibold uppercase tracking-wider">
                      PRICE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Price"
                      type="number"
                      placeholder="e.g. 199"
                      value={formData.Price}
                      onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="NoofUsers" className="text-xs font-semibold uppercase tracking-wider">
                      SEATS INCLUDED (OPTIONAL)
                    </Label>
                    <Input
                      id="NoofUsers"
                      type="number"
                      placeholder="e.g. 10 (blank for all seats)"
                      value={formData.NoofUsers}
                      onChange={(e) => setFormData({ ...formData, NoofUsers: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Currency_code" className="text-xs font-semibold uppercase tracking-wider">
                      BILLING CURRENCY
                    </Label>
                    <select
                      id="Currency_code"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.Currency_code}
                      onChange={(e) => setFormData({ ...formData, Currency_code: e.target.value })}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Country" className="text-xs font-semibold uppercase tracking-wider">
                      TARGET REGION / COUNTRY
                    </Label>
                    <Input
                      id="Country"
                      placeholder="e.g. United States or India"
                      value={formData.Country}
                      onChange={(e) => setFormData({ ...formData, Country: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: ACTIVATION & AVAILABILITY */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  STORE PUBLISHING & SCHEDULE
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5 max-w-sm">
                  <Label htmlFor="Started_Date" className="text-xs font-semibold uppercase tracking-wider">
                    ACTIVATION / START DATE
                  </Label>
                  <Input
                    id="Started_Date"
                    type="date"
                    value={formData.Started_Date}
                    onChange={(e) => setFormData({ ...formData, Started_Date: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="addonActive"
                    checked={formData.Is_Active}
                    onChange={(e) => setFormData({ ...formData, Is_Active: e.target.checked })}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <Label htmlFor="addonActive" className="cursor-pointer text-sm font-medium">
                    Addon package is active and published in the customer store
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: PACKAGE SUMMARY */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  PACKAGE SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Addon:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {formData.Addon_Name || '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Pricing:</span>
                  <span className="font-semibold text-blue-600">
                    {formData.Price ? `${formData.Currency_code} ${formData.Price}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Seats:</span>
                  <span className="font-semibold text-foreground">
                    {formData.NoofUsers ? `${formData.NoofUsers} Seats` : 'Unlimited'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-semibold ${formData.Is_Active ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {formData.Is_Active ? 'Published' : 'Draft'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: TAGS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TAGS SELECTOR
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const active = formData.selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                          active
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-background border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {active && '✓ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: NOTES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  INTERNAL NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Feature entitlement notes or operational enablement requirements..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    );
  }

  // ----------------------------------------------------------------------
  // DEFAULT TABLE LIST VIEW
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <PackagePlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Addon Master
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Create and maintain supplemental modular subscriptions, feature add-ons, and optional upgrades
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={handleOpenCreate}
          >
            <Plus className="h-4 w-4" />
            Add Addon Package
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by addon name, ID, country..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">ADDON NAME</th>
                <th className="py-3 px-4">PRICE</th>
                <th className="py-3 px-4">SEATS INCLUDED</th>
                <th className="py-3 px-4">COUNTRY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      Loading addon packages...
                    </div>
                  </td>
                </tr>
              ) : paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    No addon packages found.
                  </td>
                </tr>
              ) : (
                paginatedList.map((addon) => (
                  <tr key={addon.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                      <div>
                        <span>{addon.Addon_Name}</span>
                        {addon.Addon_Id && (
                          <div className="text-[11px] font-mono text-muted-foreground">
                            {addon.Addon_Id}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-foreground">
                      {addon.Currency_code || 'USD'} {Number(addon.Price).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {addon.NoofUsers ? `${addon.NoofUsers} Seats` : 'Unlimited / All'}
                    </td>

                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {addon.Country || 'United States'}
                    </td>

                    <td className="py-3 px-4">
                      {addon.Is_Active !== false ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                          Disabled
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(addon)}
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          title="Edit Addon"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingId(addon.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                          title="Delete Addon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Footer Pagination without rows per page dropdown */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">{startIndex}</span> to{' '}
            <span className="font-medium text-foreground">{endIndex}</span> of{' '}
            <span className="font-medium text-foreground">{totalItems}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2.5"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Addon Package"
        description="Are you sure you want to delete this addon package from the catalog?"
      />
    </div>
  );
}
