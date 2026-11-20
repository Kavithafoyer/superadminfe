'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  UserCheck,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BadgePercent,
  Calendar,
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
  useGetUserMasterListQuery,
  useCreateUserMasterMutation,
  useUpdateUserMasterMutation,
  useDeleteUserMasterMutation,
  UserMasterRecord,
} from '@/service/api/superAdminService';

const STATUS_OPTIONS = ['active', 'pending', 'approved', 'rejected'];
const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD'];
const AVAILABLE_TAGS = ['Volume Tier', 'Standard Seat', 'Enterprise Tier', 'Discounted', 'High Growth', 'Custom Quote'];

export default function UserMasterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: userMasterList = [], isLoading, refetch, isFetching } = useGetUserMasterListQuery();
  const [createUserMaster, { isLoading: isCreating }] = useCreateUserMasterMutation();
  const [updateUserMaster, { isLoading: isUpdating }] = useUpdateUserMasterMutation();
  const [deleteUserMaster, { isLoading: isDeleting }] = useDeleteUserMasterMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals & Selection
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserMasterRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State - strictly blank initial state (NO static fallback)
  const initialForm = {
    No_Of_Users: '',
    Amount_Per_User: '',
    Total_Amount: '',
    Effective_Date: '',
    Status: 'active',
    Currency_code: 'USD',
    Country: 'United States',
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  // Auto calculate total amount
  const handleUsersOrAmountChange = (field: 'No_Of_Users' | 'Amount_Per_User', value: string) => {
    const updated = { ...formData, [field]: value };
    const count = Number(field === 'No_Of_Users' ? value : formData.No_Of_Users) || 0;
    const rate = Number(field === 'Amount_Per_User' ? value : formData.Amount_Per_User) || 0;
    updated.Total_Amount = count > 0 && rate > 0 ? String(count * rate) : '';
    setFormData(updated);
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return userMasterList.filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        String(item.No_Of_Users).includes(term) ||
        String(item.Amount_Per_User).includes(term) ||
        (item.Country || '').toLowerCase().includes(term) ||
        (item.Currency_code || '').toLowerCase().includes(term);

      const matchStatus = statusFilter === 'all' || (item.Status || '').toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [userMasterList, searchTerm, statusFilter]);

  // Clean Pagination (no rows per page dropdown)
  const totalItems = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  // Auto-populate formData when directly visiting or refreshing on an edit page (/settings/user-master/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && userMasterList.length > 0) {
      const item = userMasterList.find((u: any) => String(u.id) === String(routeEditId));
      if (item && (!editingItem || String(editingItem.id) !== String(item.id))) {
        setEditingItem(item);
        setFormData({
          No_Of_Users: String(item.No_Of_Users || ''),
          Amount_Per_User: String(item.Amount_Per_User || ''),
          Total_Amount: String(item.Total_Amount || Number(item.No_Of_Users || 0) * Number(item.Amount_Per_User || 0)),
          Effective_Date: item.Effective_Date ? item.Effective_Date.split('T')[0] : '',
          Status: item.Status || 'active',
          Currency_code: item.Currency_code || 'USD',
          Country: item.Country || 'United States',
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, userMasterList, editingItem]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setInternalViewMode('create');
    router.push('/settings/user-master/create');
  };

  const handleOpenEdit = (item: UserMasterRecord) => {
    setEditingItem(item);
    setFormData({
      No_Of_Users: String(item.No_Of_Users || ''),
      Amount_Per_User: String(item.Amount_Per_User || ''),
      Total_Amount: String(item.Total_Amount || Number(item.No_Of_Users || 0) * Number(item.Amount_Per_User || 0)),
      Effective_Date: item.Effective_Date ? item.Effective_Date.split('T')[0] : '',
      Status: item.Status || 'active',
      Currency_code: item.Currency_code || 'USD',
      Country: item.Country || 'United States',
      selectedTags: [],
      notes: '',
    });
    setInternalViewMode('edit');
    router.push(`/settings/user-master/edit/${item.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/settings/user-master');
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
    if (!formData.No_Of_Users || !formData.Amount_Per_User) {
      toast.error('Number of users and unit price are required');
      return;
    }

    try {
      const payload: Partial<UserMasterRecord> = {
        No_Of_Users: Number(formData.No_Of_Users),
        Amount_Per_User: Number(formData.Amount_Per_User),
        Total_Amount: Number(formData.Total_Amount) || Number(formData.No_Of_Users) * Number(formData.Amount_Per_User),
        Effective_Date: formData.Effective_Date || undefined,
        Status: formData.Status,
        Currency_code: formData.Currency_code,
        Country: formData.Country.trim(),
      };

      if (viewMode === 'edit' && editingItem) {
        await updateUserMaster({ id: editingItem.id, ...payload }).unwrap();
        toast.success('User master tier updated successfully');
      } else {
        await createUserMaster(payload).unwrap();
        toast.success('User master tier created successfully');
      }
      handleBackToList();
      refetch();
    } catch {
      toast.error('Failed to save user master tier');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteUserMaster({ id: deletingId }).unwrap();
      toast.success('User master slab deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      refetch();
    } catch {
      toast.error('Failed to delete user master record');
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
                  User Master
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit User Slab' : 'Create User Slab'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Slab: ${formData.No_Of_Users || '0'} Seats Tier` : 'Create User Master Slab'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Slab'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: SLAB SPECIFICATIONS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  SEAT QUANTITY & UNIT PRICING
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="No_Of_Users" className="text-xs font-semibold uppercase tracking-wider">
                      NO. OF USERS / SEATS <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="No_Of_Users"
                      type="number"
                      placeholder="e.g. 10"
                      value={formData.No_Of_Users}
                      onChange={(e) => handleUsersOrAmountChange('No_Of_Users', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Amount_Per_User" className="text-xs font-semibold uppercase tracking-wider">
                      AMOUNT PER USER <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Amount_Per_User"
                      type="number"
                      placeholder="e.g. 15"
                      value={formData.Amount_Per_User}
                      onChange={(e) => handleUsersOrAmountChange('Amount_Per_User', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Total_Amount" className="text-xs font-semibold uppercase tracking-wider">
                      TOTAL CALCULATED AMOUNT
                    </Label>
                    <Input
                      id="Total_Amount"
                      type="number"
                      placeholder="Auto-calculated (Users × Rate)"
                      value={formData.Total_Amount}
                      onChange={(e) => setFormData({ ...formData, Total_Amount: e.target.value })}
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
                      TARGET COUNTRY REGION
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

            {/* Card 2: EFFECTIVE SCHEDULE & APPROVAL */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  SCHEDULE & APPROVAL STATUS
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="Effective_Date" className="text-xs font-semibold uppercase tracking-wider">
                      EFFECTIVE FROM DATE
                    </Label>
                    <Input
                      id="Effective_Date"
                      type="date"
                      value={formData.Effective_Date}
                      onChange={(e) => setFormData({ ...formData, Effective_Date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Status" className="text-xs font-semibold uppercase tracking-wider">
                      APPROVAL STATUS
                    </Label>
                    <select
                      id="Status"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.Status}
                      onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: COMMERCIAL SUMMARY */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  COMMERCIAL SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">User Seats:</span>
                  <span className="font-semibold text-foreground">{formData.No_Of_Users || '0'} Seats</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Rate Per Seat:</span>
                  <span className="font-semibold text-foreground">
                    {formData.Amount_Per_User ? `${formData.Currency_code} ${formData.Amount_Per_User}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Total Billable:</span>
                  <span className="font-semibold text-blue-600">
                    {formData.Total_Amount ? `${formData.Currency_code} ${formData.Total_Amount}` : '—'}
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
                  placeholder="Billing justification or commercial license tier terms..."
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
              <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              User Master
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure seat licensing tiers, per-user pricing slabs, and regional user quota rate structures
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
            Add User Slab
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user count, rate, country..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">USERS CAPACITY</th>
                <th className="py-3 px-4">PER USER RATE</th>
                <th className="py-3 px-4">TOTAL SLAB VALUE</th>
                <th className="py-3 px-4">COUNTRY</th>
                <th className="py-3 px-4">EFFECTIVE DATE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      Loading user master tiers...
                    </div>
                  </td>
                </tr>
              ) : paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No user master slabs configured.
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                      <BadgePercent className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{item.No_Of_Users} Users</span>
                    </td>

                    <td className="py-3 px-4">
                      {item.Currency_code || 'USD'} {Number(item.Amount_Per_User).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-semibold text-foreground">
                      {item.Currency_code || 'USD'}{' '}
                      {Number(item.Total_Amount || Number(item.No_Of_Users) * Number(item.Amount_Per_User)).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {item.Country || 'United States'}
                    </td>

                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{item.Effective_Date ? item.Effective_Date.split('T')[0] : '—'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          (item.Status || '').toLowerCase() === 'active' || (item.Status || '').toLowerCase() === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }
                      >
                        {(item.Status || 'active').toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          title="Edit Slab"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingId(item.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                          title="Delete Slab"
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
        title="Delete User Master Slab"
        description="Are you sure you want to delete this seat licensing rate tier?"
      />
    </div>
  );
}
