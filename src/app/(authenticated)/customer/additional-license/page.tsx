'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  UserPlus,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Users,
  CreditCard,
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
  ExternalLink,
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
  useGetAdditionalLicenseListQuery,
  useCreateAdditionalLicenseMutation,
  useUpdateAdditionalLicenseMutation,
  useDeleteAdditionalLicenseMutation,
  useGetSubscriptionsListQuery,
  AdditionalLicenseRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_TAGS = ['Urgent', 'Enterprise Expansion', 'Mid-cycle Addon', 'Volume Tier', 'Annual Prorated'];

export default function AdditionalLicensePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: licenseRequests = [], isLoading, refetch, isFetching } = useGetAdditionalLicenseListQuery();
  const { data: subscriptions = [], refetch: refetchSubscriptions } = useGetSubscriptionsListQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createLicense, { isLoading: isCreating }] = useCreateAdditionalLicenseMutation();
  const [updateLicense, { isLoading: isUpdating }] = useUpdateAdditionalLicenseMutation();
  const [deleteLicense, { isLoading: isDeleting }] = useDeleteAdditionalLicenseMutation();

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

  // View / Delete Dialogs
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AdditionalLicenseRecord | null>(null);

  // Form State strictly starting with EMPTY values (no static dummy values)
  const initialFormState = {
    Licensereqid: '',
    Customername: '',
    Planname: '',
    Subscription_Id: '',
    Requestedusers: '',
    UserPerAmount: '',
    UserTotalAmount: '',
    RequestDate: '',
    Currency_code: 'USD',
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-populate formData when directly visiting or refreshing on an edit page (/customer/additional-license/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && licenseRequests.length > 0) {
      const rec = licenseRequests.find((r: any) => String(r.id) === String(routeEditId) || String(r.Licensereqid) === String(routeEditId));
      if (rec && (!selectedRecord || String(selectedRecord.id) !== String(rec.id))) {
        setSelectedRecord(rec);
        setFormData({
          Licensereqid: rec.Licensereqid || '',
          Customername: rec.Customername || '',
          Planname: rec.Planname || '',
          Subscription_Id: typeof rec.Subscription_Id === 'object' ? rec.Subscription_Id?.Subscription_Id : rec.Subscription_Id || '',
          Requestedusers: String(rec.Requestedusers || ''),
          UserPerAmount: String(rec.UserPerAmount || ''),
          UserTotalAmount: String(rec.UserTotalAmount || ''),
          RequestDate: rec.RequestDate || '',
          Currency_code: rec.Currency_code || 'USD',
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, licenseRequests, selectedRecord]);

  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push('/customer/additional-license/create');
  };

  const handleOpenEdit = (rec: AdditionalLicenseRecord) => {
    setSelectedRecord(rec);
    setFormData({
      Licensereqid: rec.Licensereqid || '',
      Customername: rec.Customername || '',
      Planname: rec.Planname || '',
      Subscription_Id: typeof rec.Subscription_Id === 'object' ? rec.Subscription_Id?.Subscription_Id : rec.Subscription_Id || '',
      Requestedusers: String(rec.Requestedusers || ''),
      UserPerAmount: String(rec.UserPerAmount || ''),
      UserTotalAmount: String(rec.UserTotalAmount || ''),
      RequestDate: rec.RequestDate || '',
      Currency_code: rec.Currency_code || 'USD',
      selectedTags: [],
      notes: '',
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`/customer/additional-license/edit/${rec.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/customer/additional-license');
  };

  const handleOpenView = (rec: AdditionalLicenseRecord) => {
    setSelectedRecord(rec);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (rec: AdditionalLicenseRecord) => {
    setSelectedRecord(rec);
    setIsDeleteOpen(true);
  };

  const handleSelectSubscription = (subId: string) => {
    const sub = subscriptions.find((s: any) => s.Subscription_Id === subId || String(s.id) === subId || s.subscription_id === subId);
    if (sub) {
      const rate = sub.UnitPrice ? Number(sub.UnitPrice) / (Number(sub.No_Of_Users || sub.no_of_users) || 1) : 15;
      const roundedRate = Math.round(rate);
      setFormData((prev) => ({
        ...prev,
        Subscription_Id: sub.Subscription_Id || (sub as any).subscription_id || String(sub.id),
        Customername: sub.Customer_Name || (sub as any).customer_name || '',
        Planname: sub.Plan_Name || (sub as any).plan_name || '',
        UserPerAmount: String(roundedRate),
        UserTotalAmount: prev.Requestedusers ? String(Number(prev.Requestedusers) * roundedRate) : '',
      }));
    }
  };

  const handleUsersChange = (users: string) => {
    const rate = Number(formData.UserPerAmount) || 0;
    const count = Number(users) || 0;
    setFormData((prev) => ({
      ...prev,
      Requestedusers: users,
      UserTotalAmount: count > 0 && rate > 0 ? String(count * rate) : '',
    }));
  };

  const handleRateChange = (rate: string) => {
    const r = Number(rate) || 0;
    const count = Number(formData.Requestedusers) || 0;
    setFormData((prev) => ({
      ...prev,
      UserPerAmount: rate,
      UserTotalAmount: count > 0 && r > 0 ? String(count * r) : '',
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.Customername.trim()) errs.Customername = 'Customer name is required';
    if (!formData.Planname.trim()) errs.Planname = 'Plan name is required';
    if (!formData.Requestedusers || Number(formData.Requestedusers) <= 0) {
      errs.Requestedusers = 'Please specify valid user count';
    }
    if (!formData.UserPerAmount || Number(formData.UserPerAmount) <= 0) {
      errs.UserPerAmount = 'Rate per user is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload: Partial<AdditionalLicenseRecord> = {
        Licensereqid: formData.Licensereqid || `LIC-${Date.now().toString().slice(-6)}`,
        Customername: formData.Customername,
        Planname: formData.Planname,
        Subscription_Id: formData.Subscription_Id,
        Requestedusers: Number(formData.Requestedusers),
        UserPerAmount: Number(formData.UserPerAmount),
        UserTotalAmount: Number(formData.UserTotalAmount) || Number(formData.Requestedusers) * Number(formData.UserPerAmount),
        RequestDate: formData.RequestDate || new Date().toISOString().split('T')[0],
        Currency_code: formData.Currency_code,
        Status: 'paid',
        payment_status: 'paid',
      };

      if (viewMode === 'edit' && selectedRecord) {
        await updateLicense({ id: selectedRecord.id, ...payload }).unwrap();
        toast.success('License request updated successfully');
      } else {
        await createLicense(payload).unwrap();
        toast.success('License request created successfully');
      }

      handleBackToList();
      refetch();
    } catch {
      toast.error('Failed to save license request');
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    try {
      await deleteLicense({ id: selectedRecord.id }).unwrap();
      toast.success('License request deleted successfully');
      setIsDeleteOpen(false);
      refetch();
    } catch {
      toast.error('Failed to delete license request');
    }
  };

  const filteredList = useMemo(() => {
    return licenseRequests.filter((rec) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        (rec.Customername || '').toLowerCase().includes(q) ||
        (rec.Planname || '').toLowerCase().includes(q) ||
        (rec.Licensereqid || '').toLowerCase().includes(q);

      const status = (rec.Status || rec.payment_status || 'paid').toLowerCase();
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'paid'
          ? status === 'paid' || status === 'active'
          : status.includes('pending');

      return matchSearch && matchStatus;
    });
  }, [licenseRequests, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage, itemsPerPage]);

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE / EDIT VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
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
                  {isEdit ? 'Edit License Request' : 'New Additional License Request'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit License: ${formData.Licensereqid || 'Selected Request'}` : 'Request Additional User Licenses'}
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
            {/* Card 1: SUBSCRIPTION LINKING */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  LINK ACTIVE SUBSCRIPTION & TENANT
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="Subscription_Id" className="text-xs font-semibold uppercase tracking-wider">
                    ACTIVE SUBSCRIPTION CONTRACT
                  </Label>
                  <select
                    id="Subscription_Id"
                    value={formData.Subscription_Id}
                    onChange={(e) => handleSelectSubscription(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">-- Choose Subscription to Link --</option>
                    {subscriptions.map((s: any) => (
                      <option key={s.id} value={s.Subscription_Id || (s as any).subscription_id || String(s.id)}>
                        {s.Subscription_Id || (s as any).subscription_id || `SUB-${s.id}`} - {s.Customer_Name || (s as any).customer_name} ({s.Plan_Name || (s as any).plan_name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="Customername" className="text-xs font-semibold uppercase tracking-wider">
                      CUSTOMER / TENANT NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Customername"
                      placeholder="Enter customer name..."
                      value={formData.Customername}
                      onChange={(e) => setFormData({ ...formData, Customername: e.target.value })}
                      className={formErrors.Customername ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Customername && (
                      <span className="text-xs text-rose-500">{formErrors.Customername}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Planname" className="text-xs font-semibold uppercase tracking-wider">
                      PLAN SPECIFICATION <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Planname"
                      placeholder="Enter plan name..."
                      value={formData.Planname}
                      onChange={(e) => setFormData({ ...formData, Planname: e.target.value })}
                      className={formErrors.Planname ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Planname && (
                      <span className="text-xs text-rose-500">{formErrors.Planname}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: LICENSE QUOTA & FINANCIAL PRICING */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  LICENSE QUOTA & COMMERCIAL BREAKDOWN
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="Requestedusers" className="text-xs font-semibold uppercase tracking-wider">
                      ADDITIONAL SEATS <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Requestedusers"
                      type="number"
                      placeholder="e.g. 5"
                      value={formData.Requestedusers}
                      onChange={(e) => handleUsersChange(e.target.value)}
                      className={formErrors.Requestedusers ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Requestedusers && (
                      <span className="text-xs text-rose-500">{formErrors.Requestedusers}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="UserPerAmount" className="text-xs font-semibold uppercase tracking-wider">
                      RATE PER SEAT ($) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="UserPerAmount"
                      type="number"
                      placeholder="e.g. 15"
                      value={formData.UserPerAmount}
                      onChange={(e) => handleRateChange(e.target.value)}
                      className={formErrors.UserPerAmount ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.UserPerAmount && (
                      <span className="text-xs text-rose-500">{formErrors.UserPerAmount}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="UserTotalAmount" className="text-xs font-semibold uppercase tracking-wider">
                      TOTAL AMOUNT ($)
                    </Label>
                    <Input
                      id="UserTotalAmount"
                      type="number"
                      placeholder="Auto-calculated"
                      value={formData.UserTotalAmount}
                      onChange={(e) => setFormData({ ...formData, UserTotalAmount: e.target.value })}
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
                  REQUEST SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Tenant:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {formData.Customername || 'Not Specified'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Seats Added:</span>
                  <span className="font-semibold text-foreground">{formData.Requestedusers || '0'} Users</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Rate Per Seat:</span>
                  <span className="font-semibold text-foreground">${formData.UserPerAmount || '0'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Total Billable:</span>
                  <span className="font-semibold text-blue-600 text-sm">
                    ${formData.UserTotalAmount || '0'}
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
                  JUSTIFICATION NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Seat quota expansion justification or enterprise approval reference..."
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
              <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Additional License Requests
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage mid-cycle tenant user seat extensions, prorated additions, and license provisioning
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
            Request Additional Licenses
          </Button>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-medium">
        <Link
          href="/customer/additional-license"
          className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
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

      {/* Search & Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, plan, or request ID..."
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
                <th className="py-3 px-4">REQUEST ID</th>
                <th className="py-3 px-4">CUSTOMER TENANT</th>
                <th className="py-3 px-4">PLAN</th>
                <th className="py-3 px-4">ADDED SEATS</th>
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
                      Loading license requests...
                    </div>
                  </td>
                </tr>
              ) : paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No additional license requests found.
                  </td>
                </tr>
              ) : (
                paginatedList.map((rec) => (
                  <tr key={rec.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600">
                      {rec.Licensereqid}
                    </td>

                    <td className="py-3 px-4 font-semibold text-foreground">
                      {rec.Customername}
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="outline">{rec.Planname}</Badge>
                    </td>

                    <td className="py-3 px-4 font-medium text-foreground">
                      +{rec.Requestedusers} Seats
                    </td>

                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      ${rec.UserTotalAmount || Number(rec.Requestedusers || 0) * Number(rec.UserPerAmount || 0)}
                    </td>

                    <td className="py-3 px-4">
                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200">
                        {(rec.Status || rec.payment_status || 'PAID').toUpperCase()}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Footer Pagination without rows per page dropdown */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">{filteredList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredList.length)}
            </span>{' '}
            of <span className="font-medium text-foreground">{filteredList.length}</span> entries
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
            <DialogTitle>License Request Details</DialogTitle>
            <DialogDescription>
              Details for request {selectedRecord?.Licensereqid}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-semibold text-foreground">{selectedRecord.Customername}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Plan:</span>
                <span>{selectedRecord.Planname}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Users Added:</span>
                <span className="font-bold text-foreground">+{selectedRecord.Requestedusers} Seats</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Rate:</span>
                <span>${selectedRecord.UserPerAmount} / seat</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Total Billable:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${selectedRecord.UserTotalAmount}
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
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete License Request"
        description="Are you sure you want to delete this additional license request?"
      />
    </div>
  );
}
