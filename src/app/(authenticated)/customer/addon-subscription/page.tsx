'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  PackagePlus,
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
  Send,
  Layers,
  Calendar,
  CreditCard,
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
  useGetAddonSubscriptionListQuery,
  useCreateAddonSubscriptionMutation,
  useUpdateAddonSubscriptionMutation,
  useDeleteAddonSubscriptionMutation,
  useGetSubscriptionsListQuery,
  useCreateInvoiceMutation,
  AddonSubscriptionRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_TAGS = ['AI Analytics', 'SMS Gateway', 'Custom Domain', 'SSO Security', 'WhatsApp API', 'Priority Support'];

export default function AddonSubscriptionPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: addonRequests = [], isLoading, refetch, isFetching } = useGetAddonSubscriptionListQuery();
  const { data: subscriptions = [], refetch: refetchSubscriptions } = useGetSubscriptionsListQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createAddon, { isLoading: isCreating }] = useCreateAddonSubscriptionMutation();
  const [updateAddon, { isLoading: isUpdating }] = useUpdateAddonSubscriptionMutation();
  const [deleteAddon, { isLoading: isDeleting }] = useDeleteAddonSubscriptionMutation();
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

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AddonSubscriptionRecord | any>(null);

  // Form State strictly starting with EMPTY values (no static dummy values)
  const initialFormState = {
    Addonsubscriptionname: '',
    Subscription_Id: '',
    Customername: '',
    Planname: '',
    UnitPrice: '',
    TotalAmount: '',
    RequestDate: '',
    Currency_code: 'USD',
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-populate formData when directly visiting or refreshing on an edit page (/customer/addon-subscription/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && addonRequests.length > 0) {
      const rec = addonRequests.find((r: any) => String(r.id) === String(routeEditId) || String(r.Addonsubscriptionname) === String(routeEditId));
      if (rec && (!selectedRecord || String(selectedRecord.id) !== String(rec.id))) {
        setSelectedRecord(rec);
        setFormData({
          Addonsubscriptionname: rec.Addonsubscriptionname || '',
          Subscription_Id: typeof rec.Subscription_Id === 'object' ? rec.Subscription_Id?.Subscription_Id || rec.Subscription_Id?.id : rec.Subscription_Id || '',
          Customername: rec.Customername || rec.Customer_Name || '',
          Planname: rec.Planname || rec.Plan_Name || '',
          UnitPrice: String(rec.UnitPrice || rec.Price || ''),
          TotalAmount: String(rec.TotalAmount || rec.Amount || ''),
          RequestDate: rec.RequestDate || '',
          Currency_code: rec.Currency_code || 'USD',
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, addonRequests, selectedRecord]);

  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push('/customer/addon-subscription/create');
  };

  const handleOpenEdit = (rec: any) => {
    setSelectedRecord(rec);
    setFormData({
      Addonsubscriptionname: rec.Addonsubscriptionname || '',
      Subscription_Id: typeof rec.Subscription_Id === 'object' ? rec.Subscription_Id?.Subscription_Id || rec.Subscription_Id?.id : rec.Subscription_Id || '',
      Customername: rec.Customername || rec.Customer_Name || '',
      Planname: rec.Planname || rec.Plan_Name || '',
      UnitPrice: String(rec.UnitPrice || rec.Price || ''),
      TotalAmount: String(rec.TotalAmount || rec.Amount || ''),
      RequestDate: rec.RequestDate || '',
      Currency_code: rec.Currency_code || 'USD',
      selectedTags: [],
      notes: '',
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`/customer/addon-subscription/edit/${rec.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/customer/addon-subscription');
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
        Customername: sub.Customer_Name || sub.customer_name || '',
        Planname: sub.Plan_Name || sub.plan_name || '',
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.Subscription_Id) errors.Subscription_Id = 'Subscription is required';
    if (!formData.Addonsubscriptionname.trim()) errors.Addonsubscriptionname = 'Addon feature name is required';
    if (!formData.UnitPrice || parseFloat(formData.UnitPrice) <= 0) {
      errors.UnitPrice = 'Valid price is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload: Partial<AddonSubscriptionRecord> = {
        Addonsubscriptionname: formData.Addonsubscriptionname,
        Subscription_Id: formData.Subscription_Id,
        Customername: formData.Customername,
        Planname: formData.Planname,
        UnitPrice: parseFloat(formData.UnitPrice) || 0,
        TotalAmount: parseFloat(formData.TotalAmount || formData.UnitPrice) || 0,
        RequestDate: formData.RequestDate || new Date().toISOString().split('T')[0],
        Currency_code: formData.Currency_code,
        payment_status: 'paid',
        Status: 'Active',
      };

      if (viewMode === 'edit' && selectedRecord) {
        await updateAddon({ id: selectedRecord.id, ...payload }).unwrap();
        toast.success('Addon subscription updated successfully');
      } else {
        await createAddon(payload).unwrap();
        toast.success('Addon subscription requested successfully');
      }

      handleBackToList();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save addon subscription');
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    try {
      await deleteAddon({ id: selectedRecord.id }).unwrap();
      toast.success('Addon subscription record deleted successfully');
      setIsDeleteOpen(false);
      refetch();
    } catch {
      toast.error('Failed to delete addon record');
    }
  };

  const filteredRecords = useMemo(() => {
    return addonRequests.filter((rec: any) => {
      const name = rec.Addonsubscriptionname || '';
      const cName = rec.Customername || rec.Customer_Name || '';
      const pName = rec.Planname || rec.Plan_Name || '';

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pName.toLowerCase().includes(searchTerm.toLowerCase());

      const status = (rec.payment_status || rec.Status || 'paid').toLowerCase();
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'paid'
          ? status.includes('paid') || status.includes('active')
          : status.includes('pending') || status.includes('unpaid');

      return matchesSearch && matchesStatus;
    });
  }, [addonRequests, searchTerm, statusFilter]);

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
                  {isEdit ? 'Edit Addon Subscription' : 'New Addon Subscription Request'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Addon: ${formData.Addonsubscriptionname || 'Selected Request'}` : 'Request Addon Subscription'}
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

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Addonsubscriptionname" className="text-xs font-semibold uppercase tracking-wider">
                      ADDON FEATURE MODULE NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Addonsubscriptionname"
                      placeholder="e.g. Advanced AI Analytics & BI Forecasting"
                      value={formData.Addonsubscriptionname}
                      onChange={(e) => setFormData({ ...formData, Addonsubscriptionname: e.target.value })}
                      className={formErrors.Addonsubscriptionname ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Addonsubscriptionname && (
                      <p className="text-xs text-rose-500">{formErrors.Addonsubscriptionname}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Customername" className="text-xs font-semibold uppercase tracking-wider">
                      CUSTOMER TENANT
                    </Label>
                    <Input
                      id="Customername"
                      placeholder="Customer Name"
                      value={formData.Customername}
                      onChange={(e) => setFormData({ ...formData, Customername: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Planname" className="text-xs font-semibold uppercase tracking-wider">
                      BASE PLAN
                    </Label>
                    <Input
                      id="Planname"
                      placeholder="Plan Name"
                      value={formData.Planname}
                      onChange={(e) => setFormData({ ...formData, Planname: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: COMMERCIAL PRICING */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  COMMERCIAL PRICING & SCHEDULE
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="UnitPrice" className="text-xs font-semibold uppercase tracking-wider">
                      UNIT PRICE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="UnitPrice"
                      type="number"
                      placeholder="0.00"
                      value={formData.UnitPrice}
                      onChange={(e) => {
                        const price = e.target.value;
                        setFormData({
                          ...formData,
                          UnitPrice: price,
                          TotalAmount: price,
                        });
                      }}
                      className={formErrors.UnitPrice ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.UnitPrice && (
                      <p className="text-xs text-rose-500">{formErrors.UnitPrice}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="TotalAmount" className="text-xs font-semibold uppercase tracking-wider">
                      TOTAL AMOUNT
                    </Label>
                    <Input
                      id="TotalAmount"
                      placeholder="0.00"
                      value={formData.TotalAmount}
                      onChange={(e) => setFormData({ ...formData, TotalAmount: e.target.value })}
                      className="bg-muted font-bold text-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Currency_code" className="text-xs font-semibold uppercase tracking-wider">
                      CURRENCY
                    </Label>
                    <select
                      id="Currency_code"
                      value={formData.Currency_code}
                      onChange={(e) => setFormData({ ...formData, Currency_code: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-3">
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
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: SUMMARY */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ADDON SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Addon:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {formData.Addonsubscriptionname || 'None'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {formData.Customername || 'None'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Total Billable:</span>
                  <span className="font-semibold text-emerald-600 text-sm">
                    {formData.Currency_code} {formData.TotalAmount || '0.00'}
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
                  ACTIVATION NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Feature entitlement notes, scope of access, or terms..."
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
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            title="Go Back"
            className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shrink-0 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <PackagePlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Addon Subscriptions
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage optional modular upgrades, feature add-ons, and supplementary integrations requested by clients
            </p>
          </div>
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
            Request Addon Subscription
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
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Additional Storage
        </Link>
        <Link
          href="/customer/addon-subscription"
          className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
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
            placeholder="Search by addon name, customer, or plan..."
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

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">ADDON NAME</th>
                <th className="py-3 px-4">CUSTOMER TENANT</th>
                <th className="py-3 px-4">BASE PLAN</th>
                <th className="py-3 px-4">AMOUNT</th>
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
                      Loading addon subscriptions...
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    No addon subscriptions found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec: any) => {
                  const name = rec.Addonsubscriptionname || 'Addon Package';
                  const cName = rec.Customername || rec.Customer_Name || 'Tenant';
                  const pName = rec.Planname || rec.Plan_Name || 'Standard';
                  const amount = rec.TotalAmount || rec.Amount || rec.UnitPrice || '0';
                  const isPaid = (rec.payment_status || rec.Status || 'paid').toLowerCase().includes('paid');

                  return (
                    <tr key={rec.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>{name}</span>
                      </td>

                      <td className="py-3 px-4 text-muted-foreground">
                        {cName}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline">{pName}</Badge>
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
            <DialogTitle>Addon Subscription Details</DialogTitle>
            <DialogDescription>
              Details for addon {selectedRecord?.Addonsubscriptionname}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Addon:</span>
                <span className="font-semibold text-foreground">
                  {selectedRecord.Addonsubscriptionname}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-semibold text-foreground">
                  {selectedRecord.Customername || selectedRecord.Customer_Name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Plan:</span>
                <span>{selectedRecord.Planname || selectedRecord.Plan_Name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${selectedRecord.TotalAmount || selectedRecord.UnitPrice}
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
        title="Delete Addon Subscription"
        description="Are you sure you want to delete this addon subscription record?"
      />
    </div>
  );
}
