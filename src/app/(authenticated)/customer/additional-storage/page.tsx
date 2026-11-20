'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  HardDrive,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Receipt,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Database,
  Building,
  Save,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetAdditionalStorageListQuery,
  useCreateAdditionalStorageMutation,
  useUpdateAdditionalStorageMutation,
  useDeleteAdditionalStorageMutation,
  useGetSubscriptionsListQuery,
  useCreateInvoiceMutation,
  AdditionalStorageRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_TAGS = ['S3 Volume', 'High IOPS', 'Hot Storage', 'Archive Tier', 'Urgent Allocation', 'Enterprise Bucket'];

export default function AdditionalStoragePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: storageRequests = [], isLoading, refetch, isFetching } = useGetAdditionalStorageListQuery();
  const { data: subscriptions = [], refetch: refetchSubscriptions } = useGetSubscriptionsListQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createStorage, { isLoading: isCreating }] = useCreateAdditionalStorageMutation();
  const [updateStorage, { isLoading: isUpdating }] = useUpdateAdditionalStorageMutation();
  const [deleteStorage, { isLoading: isDeleting }] = useDeleteAdditionalStorageMutation();
  const [createInvoice, { isLoading: isInvoiceGenerating }] = useCreateInvoiceMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  // Re-fetch master data immediately when entering Create or Edit mode
  useEffect(() => {
    if (viewMode === 'create' || viewMode === 'edit') {
      refetchSubscriptions();
    }
  }, [viewMode, refetchSubscriptions]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals for view and delete
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AdditionalStorageRecord | any>(null);

  // Form State strictly starting with EMPTY values (no static dummy values)
  const initialFormState = {
    Storage_Id: '',
    Subscription_Id: '',
    Customer_Name: '',
    Plan_Name: '',
    Additionalstorage: '',
    UnitPrice: '',
    storageTotalAmount: '',
    RequestDate: '',
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-populate formData when directly visiting or refreshing on an edit page (/customer/additional-storage/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && storageRequests.length > 0) {
      const rec = storageRequests.find((r: any) => String(r.id) === String(routeEditId) || String(r.Storage_Id) === String(routeEditId));
      if (rec && (!selectedRecord || String(selectedRecord.id) !== String(rec.id))) {
        setSelectedRecord(rec);
        setFormData({
          Storage_Id: typeof rec.Storage_Id === 'object' ? (rec.Storage_Id as any)?.Storage_Id : rec.Storage_Id || '',
          Subscription_Id: typeof rec.Subscription_Id === 'object' ? rec.Subscription_Id?.Subscription_Id || rec.Subscription_Id?.id : rec.Subscription_Id || '',
          Customer_Name: rec.Customer_Name || rec.Customername || rec.Customer_Id?.Account_Owner || '',
          Plan_Name: rec.Plan_Name || rec.Planname || rec.Subscription_Id?.Plan_Name || '',
          Additionalstorage: String(rec.Additionalstorage || rec.AllocatedStorage || rec.Requestedstorage || ''),
          UnitPrice: String(rec.UnitPrice || rec.Price || '2'),
          storageTotalAmount: String(rec.storageTotalAmount || rec.UserTotalAmount || ''),
          RequestDate: rec.RequestDate || '',
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, storageRequests, selectedRecord]);

  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push('/customer/additional-storage/create');
  };

  const handleOpenEdit = (rec: any) => {
    setSelectedRecord(rec);
    setFormData({
      Storage_Id: typeof rec.Storage_Id === 'object' ? (rec.Storage_Id as any)?.Storage_Id : rec.Storage_Id || '',
      Subscription_Id: typeof rec.Subscription_Id === 'object' ? rec.Subscription_Id?.Subscription_Id || rec.Subscription_Id?.id : rec.Subscription_Id || '',
      Customer_Name: rec.Customer_Name || rec.Customername || rec.Customer_Id?.Account_Owner || '',
      Plan_Name: rec.Plan_Name || rec.Planname || rec.Subscription_Id?.Plan_Name || '',
      Additionalstorage: String(rec.Additionalstorage || rec.AllocatedStorage || rec.Requestedstorage || ''),
      UnitPrice: String(rec.UnitPrice || rec.Price || '2'),
      storageTotalAmount: String(rec.storageTotalAmount || rec.UserTotalAmount || ''),
      RequestDate: rec.RequestDate || '',
      selectedTags: [],
      notes: '',
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`/customer/additional-storage/edit/${rec.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/customer/additional-storage');
  };

  const handleOpenView = (rec: any) => {
    setSelectedRecord(rec);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (rec: any) => {
    setSelectedRecord(rec);
    setIsDeleteOpen(true);
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const handleSelectSubscription = (subId: string) => {
    const sub = subscriptions.find((s: any) => String(s.id) === subId || s.Subscription_Id === subId || s.subscription_id === subId);
    if (sub) {
      setFormData((prev) => ({
        ...prev,
        Subscription_Id: String(sub.id),
        Customer_Name: sub.Customer_Name || sub.customer_name || '',
        Plan_Name: sub.Plan_Name || sub.plan_name || '',
        UnitPrice: '2',
      }));
    }
  };

  const handleStorageSizeChange = (val: string) => {
    const size = parseFloat(val) || 0;
    const unitPrice = parseFloat(formData.UnitPrice) || 2;
    setFormData((prev) => ({
      ...prev,
      Additionalstorage: val,
      storageTotalAmount: size > 0 ? (size * unitPrice).toFixed(2) : '',
    }));
  };

  const handleUnitPriceChange = (val: string) => {
    const unitPrice = parseFloat(val) || 0;
    const size = parseFloat(formData.Additionalstorage) || 0;
    setFormData((prev) => ({
      ...prev,
      UnitPrice: val,
      storageTotalAmount: unitPrice > 0 ? (size * unitPrice).toFixed(2) : '',
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.Subscription_Id) errors.Subscription_Id = 'Subscription is required';
    if (!formData.Additionalstorage || parseFloat(formData.Additionalstorage) <= 0) {
      errors.Additionalstorage = 'Valid storage capacity (GB) is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload: Partial<AdditionalStorageRecord> = {
        Storage_Id: formData.Storage_Id || `STR-${Date.now().toString().slice(-4)}`,
        Subscription_Id: formData.Subscription_Id,
        Customer_Name: formData.Customer_Name,
        Plan_Name: formData.Plan_Name,
        Additionalstorage: formData.Additionalstorage,
        UnitPrice: formData.UnitPrice,
        storageTotalAmount: formData.storageTotalAmount || (parseFloat(formData.Additionalstorage) * (parseFloat(formData.UnitPrice) || 2)).toFixed(2),
        payment_status: 'paid',
        Status: 'Active',
      };

      if (viewMode === 'edit' && selectedRecord) {
        await updateStorage({ id: selectedRecord.id, ...payload }).unwrap();
        toast.success('Additional storage updated successfully');
      } else {
        await createStorage(payload).unwrap();
        toast.success('Additional storage requested successfully');
      }

      handleBackToList();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save storage request');
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    try {
      await deleteStorage({ id: selectedRecord.id }).unwrap();
      toast.success('Storage record deleted successfully');
      setIsDeleteOpen(false);
      refetch();
    } catch {
      toast.error('Failed to delete storage record');
    }
  };

  const filteredRecords = useMemo(() => {
    return storageRequests.filter((rec: any) => {
      const cName = rec.Customer_Name || rec.Customername || rec.Customer_Id?.Account_Owner || '';
      const pName = rec.Plan_Name || rec.Planname || rec.Subscription_Id?.Plan_Name || '';
      const sId = rec.Storage_Id?.Storage_Id || rec.Storage_Id || '';

      const matchesSearch =
        cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sId.toLowerCase().includes(searchTerm.toLowerCase());

      const status = (rec.payment_status || rec.Status || 'paid').toLowerCase();
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'paid'
          ? status.includes('paid') || status.includes('active')
          : status.includes('pending') || status.includes('unpaid');

      return matchesSearch && matchesStatus;
    });
  }, [storageRequests, searchTerm, statusFilter]);

  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE / EDIT VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <form onSubmit={handleSubmitForm} className="space-y-6">
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
                <span className="hover:underline cursor-pointer" onClick={handleBackToList}>
                  Customer Management
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Storage Request' : 'New Additional Storage Request'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Storage: ${formData.Storage_Id || 'Selected Request'}` : 'Request Additional Cloud Storage'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Request'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: TENANT & SUBSCRIPTION MAPPING */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  LINK ACTIVE SUBSCRIPTION & TENANT
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Subscription_Id" className="text-xs font-semibold uppercase tracking-wider">
                      ACTIVE SUBSCRIPTION <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="Subscription_Id"
                      value={formData.Subscription_Id}
                      onChange={(e) => handleSelectSubscription(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select Subscription</option>
                      {subscriptions.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.Subscription_Id || s.subscription_id || `#SUB-${s.id}`} - {s.Customer_Name || s.customer_name || s.Plan_Name}
                        </option>
                      ))}
                    </select>
                    {formErrors.Subscription_Id && (
                      <p className="text-xs text-rose-500">{formErrors.Subscription_Id}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Customer_Name" className="text-xs font-semibold uppercase tracking-wider">
                      CUSTOMER TENANT
                    </Label>
                    <Input
                      id="Customer_Name"
                      placeholder="Customer Name"
                      value={formData.Customer_Name}
                      onChange={(e) => setFormData({ ...formData, Customer_Name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Plan_Name" className="text-xs font-semibold uppercase tracking-wider">
                      ASSIGNED PLAN
                    </Label>
                    <Input
                      id="Plan_Name"
                      placeholder="Plan Name"
                      value={formData.Plan_Name}
                      onChange={(e) => setFormData({ ...formData, Plan_Name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Storage_Id" className="text-xs font-semibold uppercase tracking-wider">
                      STORAGE REQUEST ID
                    </Label>
                    <Input
                      id="Storage_Id"
                      placeholder="Auto-generated if blank"
                      value={formData.Storage_Id}
                      onChange={(e) => setFormData({ ...formData, Storage_Id: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="RequestDate" className="text-xs font-semibold uppercase tracking-wider">
                      REQUEST DATE
                    </Label>
                    <Input
                      id="RequestDate"
                      type="date"
                      value={formData.RequestDate}
                      onChange={(e) => setFormData({ ...formData, RequestDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: STORAGE CAPACITY & FINANCIAL PRICING */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  STORAGE CAPACITY & COMMERCIAL PRICING
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="Additionalstorage" className="text-xs font-semibold uppercase tracking-wider">
                      STORAGE CAPACITY (GB) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Additionalstorage"
                      type="number"
                      placeholder="e.g. 50"
                      value={formData.Additionalstorage}
                      onChange={(e) => handleStorageSizeChange(e.target.value)}
                      className={formErrors.Additionalstorage ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Additionalstorage && (
                      <p className="text-xs text-rose-500">{formErrors.Additionalstorage}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="UnitPrice" className="text-xs font-semibold uppercase tracking-wider">
                      RATE PER GB ($)
                    </Label>
                    <Input
                      id="UnitPrice"
                      type="number"
                      placeholder="2.00"
                      value={formData.UnitPrice}
                      onChange={(e) => handleUnitPriceChange(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="storageTotalAmount" className="text-xs font-semibold uppercase tracking-wider">
                      TOTAL AMOUNT ($)
                    </Label>
                    <Input
                      id="storageTotalAmount"
                      placeholder="Auto-calculated"
                      value={formData.storageTotalAmount}
                      readOnly
                      className="bg-muted font-bold text-emerald-600"
                    />
                  </div>
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
                  STORAGE SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {formData.Customer_Name || 'None'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Capacity Added:</span>
                  <span className="font-semibold text-foreground">+{formData.Additionalstorage || '0'} GB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Per GB Rate:</span>
                  <span className="font-semibold text-foreground">${formData.UnitPrice || '2'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Total Billable:</span>
                  <span className="font-semibold text-emerald-600 text-sm">
                    ${formData.storageTotalAmount || '0.00'}
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
                  STORAGE AUDIT NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="AWS S3 bucket quota enlargement justification or ticket reference..."
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
              Additional Storage Requests
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor, provision, and bill client disk quota expansions beyond baseline subscription limits
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
            Request Additional Storage
          </Button>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-medium">
        <Link
          href="/customer/additional-license"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Additional Licenses
        </Link>
        <Link
          href="/customer/additional-storage"
          className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
        >
          Additional Storage
        </Link>
        <Link
          href="/customer/addon-subscription"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Addon Subscriptions
        </Link>
        <Link
          href="/customer/renewal-due"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Renewals Due
        </Link>
        <Link
          href="/customer/cancel-plan"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Cancellation Requests
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, plan, or storage ID..."
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
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Active / Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Storage Requests Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">STORAGE ID</th>
                <th className="py-3 px-4">CUSTOMER TENANT</th>
                <th className="py-3 px-4">PLAN</th>
                <th className="py-3 px-4">CAPACITY ADDED</th>
                <th className="py-3 px-4">AMOUNT</th>
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
                      Loading storage requests...
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No storage requests found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec: any) => {
                  const sId = rec.Storage_Id?.Storage_Id || rec.Storage_Id || `STR-${rec.id}`;
                  const cName = rec.Customer_Name || rec.Customername || rec.Customer_Id?.Account_Owner || 'Tenant';
                  const pName = rec.Plan_Name || rec.Planname || rec.Subscription_Id?.Plan_Name || 'Standard';
                  const size = rec.Additionalstorage || rec.AllocatedStorage || rec.Requestedstorage || '10';
                  const amount = rec.storageTotalAmount || rec.UserTotalAmount || (parseFloat(size) * 2).toFixed(2);
                  const isPaid = (rec.payment_status || rec.Status || 'paid').toLowerCase().includes('paid');

                  return (
                    <tr key={rec.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-blue-600">
                        {sId}
                      </td>

                      <td className="py-3 px-4 font-semibold text-foreground">
                        {cName}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline">{pName}</Badge>
                      </td>

                      <td className="py-3 px-4 font-medium text-foreground">
                        +{size} GB
                      </td>

                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        ${amount}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          className={
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200'
                          }
                        >
                          {isPaid ? 'PAID' : 'PENDING'}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenView(rec)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(rec)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                            title="Edit Request"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(rec)}
                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                            title="Delete Request"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Footer Pagination without rows per page dropdown */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">{totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, totalRecords)}
            </span>{' '}
            of <span className="font-medium text-foreground">{totalRecords}</span> entries
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

      {/* VIEW MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Storage Request Details</DialogTitle>
            <DialogDescription>
              Details for request {selectedRecord?.Storage_Id?.Storage_Id || selectedRecord?.Storage_Id}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-semibold text-foreground">
                  {selectedRecord.Customer_Name || selectedRecord.Customername}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Plan:</span>
                <span>{selectedRecord.Plan_Name || selectedRecord.Planname}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Capacity Added:</span>
                <span className="font-bold text-foreground">
                  +{selectedRecord.Additionalstorage || selectedRecord.AllocatedStorage || selectedRecord.Requestedstorage} GB
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Rate:</span>
                <span>${selectedRecord.UnitPrice || 2} / GB</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Total Billable:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${selectedRecord.storageTotalAmount || selectedRecord.UserTotalAmount}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteRecord}
        isDeleting={isDeleting}
        title="Delete Storage Request"
        description="Are you sure you want to delete this additional storage request?"
      />
    </div>
  );
}
