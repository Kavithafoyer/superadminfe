'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  HardDrive,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Database,
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
  useGetStorageMasterListQuery,
  useCreateStorageMasterMutation,
  useUpdateStorageMasterMutation,
  useDeleteStorageMasterMutation,
  StorageMasterRecord,
} from '@/service/api/superAdminService';

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD'];
const AVAILABLE_TAGS = ['Addon', 'Base Tier', 'High Capacity', 'Enterprise', 'Standard', 'Promotional'];

export default function StorageMasterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: storageList = [], isLoading, refetch, isFetching } = useGetStorageMasterListQuery();
  const [createStorage, { isLoading: isCreating }] = useCreateStorageMasterMutation();
  const [updateStorage, { isLoading: isUpdating }] = useUpdateStorageMasterMutation();
  const [deleteStorage, { isLoading: isDeleting }] = useDeleteStorageMasterMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals & Selection
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStorage, setEditingStorage] = useState<StorageMasterRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State - strictly blank initial state (NO static fallback)
  const initialForm = {
    Name: '',
    Storage_Size: '',
    Price: '',
    Country: 'United States',
    Currency: 'USD',
    Isactive: true,
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  // Filtering
  const filteredList = useMemo(() => {
    return storageList.filter((s) => {
      const term = searchTerm.toLowerCase();
      return (
        (s.Name || '').toLowerCase().includes(term) ||
        (s.Storage_Size || '').toLowerCase().includes(term) ||
        (s.Storage_Id || '').toLowerCase().includes(term) ||
        (s.Country || '').toLowerCase().includes(term)
      );
    });
  }, [storageList, searchTerm]);

  // Clean Pagination (no rows per page dropdown)
  const totalItems = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  // Auto-populate formData when directly visiting or refreshing on an edit page (/settings/storage/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && storageList.length > 0) {
      const s = storageList.find((item: any) => String(item.id) === String(routeEditId) || String(item.Storage_Id) === String(routeEditId));
      if (s && (!editingStorage || String(editingStorage.id) !== String(s.id))) {
        setEditingStorage(s);
        setFormData({
          Name: s.Name || '',
          Storage_Size: s.Storage_Size || '',
          Price: String(s.Price || ''),
          Country: s.Country || 'United States',
          Currency: s.Currency || 'USD',
          Isactive: Boolean(s.Isactive),
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, storageList, editingStorage]);

  const handleOpenCreate = () => {
    setEditingStorage(null);
    setFormData(initialForm);
    setInternalViewMode('create');
    router.push('/settings/storage/create');
  };

  const handleOpenEdit = (s: StorageMasterRecord) => {
    setEditingStorage(s);
    setFormData({
      Name: s.Name || '',
      Storage_Size: s.Storage_Size || '',
      Price: String(s.Price || ''),
      Country: s.Country || 'United States',
      Currency: s.Currency || 'USD',
      Isactive: Boolean(s.Isactive),
      selectedTags: [],
      notes: '',
    });
    setInternalViewMode('edit');
    router.push(`/settings/storage/edit/${s.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/settings/storage');
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
    if (!formData.Name.trim() || !formData.Storage_Size.trim() || !formData.Price) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      const payload: Partial<StorageMasterRecord> = {
        Name: formData.Name.trim(),
        Storage_Size: formData.Storage_Size.trim(),
        Price: Number(formData.Price),
        Country: formData.Country.trim(),
        Currency: formData.Currency,
        Isactive: formData.Isactive,
      };

      if (viewMode === 'edit' && editingStorage) {
        await updateStorage({ id: editingStorage.id, ...payload }).unwrap();
        toast.success('Storage tier updated successfully');
      } else {
        await createStorage(payload).unwrap();
        toast.success('Storage tier created successfully');
      }
      handleBackToList();
      refetch();
    } catch {
      toast.error('Failed to save storage tier');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteStorage({ id: deletingId }).unwrap();
      toast.success('Storage tier deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      refetch();
    } catch {
      toast.error('Failed to delete storage tier');
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
                  Storage Master
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Storage Tier' : 'Create Storage Tier'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Storage Tier: ${formData.Name || 'Selected Tier'}` : 'Create New Storage Tier'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Storage Tier'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: STORAGE SPECIFICATIONS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  STORAGE SPECIFICATIONS
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Name" className="text-xs font-semibold uppercase tracking-wider">
                      STORAGE PLAN NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Name"
                      placeholder="e.g. Cloud Storage Pro 100GB"
                      value={formData.Name}
                      onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Storage_Size" className="text-xs font-semibold uppercase tracking-wider">
                      ALLOCATED SIZE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Storage_Size"
                      placeholder="e.g. 100 GB or 1 TB"
                      value={formData.Storage_Size}
                      onChange={(e) => setFormData({ ...formData, Storage_Size: e.target.value })}
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
                      placeholder="e.g. 89"
                      value={formData.Price}
                      onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Currency" className="text-xs font-semibold uppercase tracking-wider">
                      CURRENCY
                    </Label>
                    <select
                      id="Currency"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.Currency}
                      onChange={(e) => setFormData({ ...formData, Currency: e.target.value })}
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
                      COUNTRY REGION
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

            {/* Card 2: AVAILABILITY RULES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  AVAILABILITY & PRICING RULES
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="storageActive"
                    checked={formData.Isactive}
                    onChange={(e) => setFormData({ ...formData, Isactive: e.target.checked })}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <Label htmlFor="storageActive" className="cursor-pointer text-sm font-medium">
                    Tier is active and available for customer addon purchase across tenant accounts
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: SUMMARY */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TIER SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-semibold text-foreground">{formData.Storage_Size || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Pricing:</span>
                  <span className="font-semibold text-blue-600">
                    {formData.Price ? `${formData.Currency} ${formData.Price}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-semibold ${formData.Isactive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {formData.Isactive ? 'Published' : 'Inactive'}
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
                  placeholder="Internal storage provisioning requirements or AWS S3 tier details..."
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
              <HardDrive className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Storage Master
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure tiered storage quotas, additional cloud storage addon pricing, and regional currencies
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
            Add Storage Tier
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by plan name, size, or country..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Storage Tiers Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">TIER NAME</th>
                <th className="py-3 px-4">ALLOCATED SIZE</th>
                <th className="py-3 px-4">PRICE</th>
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
                      Loading storage master records...
                    </div>
                  </td>
                </tr>
              ) : paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    No storage packages found.
                  </td>
                </tr>
              ) : (
                paginatedList.map((tier) => (
                  <tr key={tier.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-600 shrink-0" />
                      <div>
                        <span>{tier.Name}</span>
                        {tier.Storage_Id && (
                          <div className="text-[11px] font-mono text-muted-foreground">
                            {tier.Storage_Id}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-mono bg-blue-500/10 text-blue-600 border-blue-500/20">
                        {tier.Storage_Size}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-semibold text-foreground">
                      {tier.Currency || 'USD'} {Number(tier.Price).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {tier.Country || 'United States'}
                    </td>

                    <td className="py-3 px-4">
                      {tier.Isactive ? (
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
                          onClick={() => handleOpenEdit(tier)}
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          title="Edit Tier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingId(tier.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                          title="Delete Tier"
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
        title="Delete Storage Tier"
        description="Are you sure you want to delete this storage tier from the master catalog?"
      />
    </div>
  );
}
