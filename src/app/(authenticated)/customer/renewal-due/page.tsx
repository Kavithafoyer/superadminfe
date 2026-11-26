'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  CalendarClock,
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
  Calendar,
  AlertCircle,
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
  useGetRenewalDueListQuery,
  useCreateRenewalMutation,
  useUpdateRenewalMutation,
  useDeleteRenewalMutation,
  useGetSubscriptionsListQuery,
  useCreateInvoiceMutation,
  RenewalDueRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_TAGS = ['Urgent Renewal', 'Annual Contract', 'High Value Client', 'Discount Approved', 'Auto-renew Enabled'];

export default function RenewalDuePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: renewalRecords = [], isLoading, refetch, isFetching } = useGetRenewalDueListQuery();
  const { data: subscriptions = [], refetch: refetchSubscriptions } = useGetSubscriptionsListQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createRenewal, { isLoading: isCreating }] = useCreateRenewalMutation();
  const [updateRenewal, { isLoading: isUpdating }] = useUpdateRenewalMutation();
  const [deleteRenewal, { isLoading: isDeleting }] = useDeleteRenewalMutation();
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'due' | 'renewed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RenewalDueRecord | any>(null);

  // Form State strictly starting with EMPTY values (no static dummy values)
  const initialFormState = {
    Renewal_Id: '',
    Customer_Name: '',
    Subscription_Id: '',
    Plan_Name: '',
    RenewalDate: '',
    RenewalPeriod: '1 Year',
    RenewalAmount: '',
    TaxAmount: '',
    Payment_Status: 'Pending',
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-populate formData when directly visiting or refreshing on an edit page (/customer/renewal-due/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && renewalRecords.length > 0) {
      const rec = renewalRecords.find((r: any) => String(r.id) === String(routeEditId) || String(r.Renewal_Id) === String(routeEditId));
      if (rec && (!selectedRecord || String(selectedRecord.id) !== String(rec.id))) {
        setSelectedRecord(rec);
        setFormData({
          Renewal_Id: rec.Renewal_Id || '',
          Customer_Name: rec.Customer_Name || rec.Customer_Id?.Account_Owner || rec.Customer_Id?.FirstName || '',
          Subscription_Id: typeof rec.Subscription_Id === 'object' ? rec.Subscription_Id?.Subscription_Id || rec.Subscription_Id?.id : rec.Subscription_Id || '',
          Plan_Name: rec.Plan_Name || rec.Subscription_Id?.Plan_Name || '',
          RenewalDate: rec.RenewalDate ? rec.RenewalDate.split('T')[0] : '',
          RenewalPeriod: rec.RenewalPeriod || '1 Year',
          RenewalAmount: String(rec.RenewalAmount || rec.Amount || ''),
          TaxAmount: String(rec.TaxAmount || ''),
          Payment_Status: rec.Payment_Status || 'Pending',
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, renewalRecords, selectedRecord]);

  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push('/customer/renewal-due/create');
  };

  const handleOpenEdit = (rec: any) => {
    setSelectedRecord(rec);
    setFormData({
      Renewal_Id: rec.Renewal_Id || '',
      Customer_Name: rec.Customer_Name || rec.Customer_Id?.Account_Owner || rec.Customer_Id?.FirstName || '',
      Subscription_Id: typeof rec.Subscription_Id === 'object' ? rec.Subscription_Id?.Subscription_Id || rec.Subscription_Id?.id : rec.Subscription_Id || '',
      Plan_Name: rec.Plan_Name || rec.Subscription_Id?.Plan_Name || '',
      RenewalDate: rec.RenewalDate ? rec.RenewalDate.split('T')[0] : '',
      RenewalPeriod: rec.RenewalPeriod || '1 Year',
      RenewalAmount: String(rec.RenewalAmount || rec.Amount || ''),
      TaxAmount: String(rec.TaxAmount || ''),
      Payment_Status: rec.Payment_Status || 'Pending',
      selectedTags: [],
      notes: '',
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`/customer/renewal-due/edit/${rec.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/customer/renewal-due');
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
        RenewalAmount: String(sub.SuscriptionAmount || sub.UnitPrice || 0),
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.Customer_Name.trim()) errors.Customer_Name = 'Customer name is required';
    if (!formData.RenewalDate) errors.RenewalDate = 'Renewal due date is required';
    if (!formData.RenewalAmount || parseFloat(formData.RenewalAmount) <= 0) {
      errors.RenewalAmount = 'Valid renewal amount is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload: Partial<RenewalDueRecord> = {
        Renewal_Id: formData.Renewal_Id || `RNW-${Date.now().toString().slice(-4)}`,
        Customer_Name: formData.Customer_Name,
        Subscription_Id: formData.Subscription_Id,
        Plan_Name: formData.Plan_Name,
        RenewalDate: formData.RenewalDate,
        RenewalPeriod: formData.RenewalPeriod,
        RenewalAmount: formData.RenewalAmount,
        TaxAmount: formData.TaxAmount || '0',
        Payment_Status: formData.Payment_Status,
        Status: formData.Payment_Status === 'Paid' ? 'Renewed' : 'Due',
      };

      if (viewMode === 'edit' && selectedRecord) {
        await updateRenewal({ id: selectedRecord.id, ...payload }).unwrap();
        toast.success('Renewal schedule updated successfully');
      } else {
        await createRenewal(payload).unwrap();
        toast.success('Renewal scheduled successfully');
      }

      handleBackToList();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save renewal schedule');
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    try {
      await deleteRenewal({ id: selectedRecord.id }).unwrap();
      toast.success('Renewal record deleted successfully');
      setIsDeleteOpen(false);
      refetch();
    } catch {
      toast.error('Failed to delete renewal record');
    }
  };

  const filteredRecords = useMemo(() => {
    return renewalRecords.filter((rec: any) => {
      const cName = rec.Customer_Name || rec.Customer_Id?.Account_Owner || rec.Customer_Id?.FirstName || '';
      const pName = rec.Plan_Name || rec.Subscription_Id?.Plan_Name || '';
      const rId = rec.Renewal_Id || '';

      const matchesSearch =
        cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rId.toLowerCase().includes(searchTerm.toLowerCase());

      const status = (rec.Payment_Status || rec.Status || 'due').toLowerCase();
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'renewed'
          ? status.includes('paid') || status.includes('renewed')
          : status.includes('pending') || status.includes('due');

      return matchesSearch && matchesStatus;
    });
  }, [renewalRecords, searchTerm, statusFilter]);

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
                  {isEdit ? 'Edit Renewal Schedule' : 'Schedule Subscription Renewal'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Renewal: ${formData.Renewal_Id || 'Selected Contract'}` : 'Schedule Subscription Renewal'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Schedule'}
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
                      EXISTING ACTIVE SUBSCRIPTION
                    </Label>
                    <select
                      id="Subscription_Id"
                      value={formData.Subscription_Id}
                      onChange={(e) => handleSelectSubscription(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Select Existing Subscription</option>
                      {subscriptions.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.Subscription_Id || s.subscription_id || `#SUB-${s.id}`} - {s.Customer_Name || s.customer_name || s.Plan_Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Customer_Name" className="text-xs font-semibold uppercase tracking-wider">
                      CUSTOMER / TENANT NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Customer_Name"
                      placeholder="Enter Customer Name"
                      value={formData.Customer_Name}
                      onChange={(e) => setFormData({ ...formData, Customer_Name: e.target.value })}
                      className={formErrors.Customer_Name ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Customer_Name && (
                      <p className="text-xs text-rose-500">{formErrors.Customer_Name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Plan_Name" className="text-xs font-semibold uppercase tracking-wider">
                      PLAN SPECIFICATION
                    </Label>
                    <Input
                      id="Plan_Name"
                      placeholder="Plan Name"
                      value={formData.Plan_Name}
                      onChange={(e) => setFormData({ ...formData, Plan_Name: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: RENEWAL TERMS & COMMERCIAL PRICING */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  RENEWAL TERMS & FINANCIAL PRICING
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="RenewalDate" className="text-xs font-semibold uppercase tracking-wider">
                      RENEWAL DUE DATE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="RenewalDate"
                      type="date"
                      value={formData.RenewalDate}
                      onChange={(e) => setFormData({ ...formData, RenewalDate: e.target.value })}
                      className={formErrors.RenewalDate ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.RenewalDate && (
                      <p className="text-xs text-rose-500">{formErrors.RenewalDate}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="RenewalPeriod" className="text-xs font-semibold uppercase tracking-wider">
                      EXTENSION TERM
                    </Label>
                    <select
                      id="RenewalPeriod"
                      value={formData.RenewalPeriod}
                      onChange={(e) => setFormData({ ...formData, RenewalPeriod: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="1 Year">1 Year</option>
                      <option value="2 Years">2 Years</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="RenewalAmount" className="text-xs font-semibold uppercase tracking-wider">
                      RENEWAL AMOUNT ($) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="RenewalAmount"
                      type="number"
                      placeholder="0.00"
                      value={formData.RenewalAmount}
                      onChange={(e) => setFormData({ ...formData, RenewalAmount: e.target.value })}
                      className={formErrors.RenewalAmount ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.RenewalAmount && (
                      <p className="text-xs text-rose-500">{formErrors.RenewalAmount}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="TaxAmount" className="text-xs font-semibold uppercase tracking-wider">
                      TAX AMOUNT ($)
                    </Label>
                    <Input
                      id="TaxAmount"
                      type="number"
                      placeholder="0.00"
                      value={formData.TaxAmount}
                      onChange={(e) => setFormData({ ...formData, TaxAmount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Payment_Status" className="text-xs font-semibold uppercase tracking-wider">
                      SETTLEMENT STATUS
                    </Label>
                    <select
                      id="Payment_Status"
                      value={formData.Payment_Status}
                      onChange={(e) => setFormData({ ...formData, Payment_Status: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="Pending">Pending Invoice</option>
                      <option value="Paid">Paid / Settled</option>
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
                  RENEWAL SUMMARY
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
                  <span className="text-muted-foreground">Term:</span>
                  <span className="font-semibold text-foreground">{formData.RenewalPeriod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="font-semibold text-foreground">{formData.RenewalDate || '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-blue-600 text-sm">
                    ${formData.RenewalAmount || '0.00'}
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
                  RENEWAL NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Renewal notice context, discount approval reference, or terms..."
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
                <CalendarClock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Renewals Due Management
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Automate expiration tracking, generate pre-renewal invoices, and process contract renewals
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
            Schedule Renewal
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
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Addon Subscriptions
        </Link>
        <Link
          href="/customer/renewal-due"
          className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
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
            placeholder="Search by customer, plan, or renewal ID..."
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
            <option value="due">Renewal Due</option>
            <option value="renewed">Renewed / Paid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">RENEWAL ID</th>
                <th className="py-3 px-4">CUSTOMER TENANT</th>
                <th className="py-3 px-4">PLAN</th>
                <th className="py-3 px-4">DUE DATE</th>
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
                      Loading renewal schedules...
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No renewal records found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec: any) => {
                  const rId = rec.Renewal_Id || `RNW-${rec.id}`;
                  const cName = rec.Customer_Name || rec.Customer_Id?.Account_Owner || rec.Customer_Id?.FirstName || 'Customer';
                  const pName = rec.Plan_Name || rec.Subscription_Id?.Plan_Name || 'Standard';
                  const date = rec.RenewalDate ? rec.RenewalDate.split('T')[0] : '—';
                  const amount = rec.RenewalAmount || rec.Amount || '0';
                  const isRenewed = (rec.Payment_Status || rec.Status || 'due').toLowerCase().includes('paid') || (rec.Payment_Status || rec.Status || 'due').toLowerCase().includes('renewed');

                  return (
                    <tr key={rec.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-blue-600">
                        {rId}
                      </td>

                      <td className="py-3 px-4 font-semibold text-foreground">
                        {cName}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline">{pName}</Badge>
                      </td>

                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{date}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-foreground">
                        ${amount}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          className={
                            isRenewed
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200'
                          }
                        >
                          {isRenewed ? 'RENEWED' : 'DUE'}
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
                            title="Edit Renewal"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(rec)}
                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                            title="Delete Renewal"
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
            <DialogTitle>Renewal Schedule Details</DialogTitle>
            <DialogDescription>
              Details for schedule {selectedRecord?.Renewal_Id}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-semibold text-foreground">
                  {selectedRecord.Customer_Name || selectedRecord.Customer_Id?.Account_Owner}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Plan:</span>
                <span>{selectedRecord.Plan_Name || selectedRecord.Subscription_Id?.Plan_Name}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium text-foreground">
                  {selectedRecord.RenewalDate ? selectedRecord.RenewalDate.split('T')[0] : '—'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Term:</span>
                <span>{selectedRecord.RenewalPeriod || '1 Year'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Renewal Amount:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${selectedRecord.RenewalAmount || selectedRecord.Amount}
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
        title="Delete Renewal Schedule"
        description="Are you sure you want to delete this renewal schedule record?"
      />
    </div>
  );
}
