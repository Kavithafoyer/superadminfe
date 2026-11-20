'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  DollarSign,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Edit2,
  Trash2,
  Eye,
  Check,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Save,
  Tag,
  Server,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetSubscriptionsListQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetAccountsListQuery,
  useGetPlansListQuery,
  SubscriptionRecord,
} from '@/service/api/superAdminService';

const SUBSCRIPTION_PERIODS = ['Monthly', 'Quarterly', 'Half Yearly', 'Annual'];
const STATUS_OPTIONS = ['active', 'trial', 'inactive', 'expired'];
const AVAILABLE_TAGS = ['Direct Client', 'Partner Sourced', 'Enterprise Agreement', 'Annual Advance', 'Auto-renewing', 'Custom Quota'];

export default function SubscriptionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const basePath = pathname?.startsWith('/subscriptions') ? '/subscriptions' : '/sales/subscriptions';
  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: subscriptions = [], isLoading, refetch, isFetching } = useGetSubscriptionsListQuery();
  const { data: accounts = [], refetch: refetchAccounts } = useGetAccountsListQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: plans = [], refetch: refetchPlans } = useGetPlansListQuery(undefined, { refetchOnMountOrArgChange: true });

  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states for Invoice and Delete
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubscriptionRecord | null>(null);

  // Form State adhering strictly to blank initial values (NO dummy static fallback)
  const initialFormState = {
    Customer_Id: '',
    Customer_Name: '',
    Plan_Id: '',
    Plan_Name: '',
    Subscription_Name: '',
    No_Of_Users: '',
    Base_Users: '',
    UnitPrice: '',
    TaxAmount: '',
    discount: '',
    Server_cost: '',
    Operation_cost: '',
    SuscriptionAmount: '',
    SubscriptionPeriod: 'Monthly',
    start_date: '',
    end_date: '',
    status: 'active' as string,
    Basestorage_Size: '',
    auto_renew: true,
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Re-fetch dropdown dependencies immediately when opening Create or Edit mode
  useEffect(() => {
    if (viewMode === 'create' || viewMode === 'edit') {
      refetchAccounts();
      refetchPlans();
    }
  }, [viewMode, refetchAccounts, refetchPlans]);

  // Recalculate total amount when financial fields change
  useEffect(() => {
    const unit = Number(formData.UnitPrice) || 0;
    const tax = Number(formData.TaxAmount) || 0;
    const srv = Number(formData.Server_cost) || 0;
    const ops = Number(formData.Operation_cost) || 0;
    const disc = Number(formData.discount) || 0;
    const total = Math.max(0, unit + tax + srv + ops - disc);
    if (unit > 0 || tax > 0 || srv > 0 || ops > 0 || disc > 0) {
      setFormData((prev) => ({
        ...prev,
        SuscriptionAmount: String(total),
      }));
    }
  }, [formData.UnitPrice, formData.TaxAmount, formData.Server_cost, formData.Operation_cost, formData.discount]);

  const handleSelectPlan = (planId: string) => {
    const selected = plans.find((p) => String(p.id) === planId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        Plan_Id: String(selected.id),
        Plan_Name: selected.name,
        UnitPrice: String(selected.monthly_price || selected.price || 0),
        No_Of_Users: String(selected.no_of_users || selected.noofuser || 10),
        Base_Users: String(selected.no_of_users || selected.noofuser || 10),
        Basestorage_Size: String(selected.storage_limit || selected.storage || 50),
        Subscription_Name: prev.Subscription_Name || `${prev.Customer_Name || 'Tenant'} - ${selected.name}`,
      }));
    }
  };

  const handleSelectCustomer = (accId: string) => {
    const selected = accounts.find((a) => String(a.id) === accId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        Customer_Id: String(selected.id),
        Customer_Name: selected.Organization_Name || selected.Contact_Name,
        Subscription_Name: `${selected.Organization_Name || selected.Contact_Name} - Subscription`,
      }));
    }
  };

  // Auto-populate formData when directly visiting or refreshing on an edit page
  useEffect(() => {
    if (isEditRoute && routeEditId && subscriptions.length > 0) {
      const sub = subscriptions.find((s: any) => String(s.id) === String(routeEditId) || String(s.Subscription_Id) === String(routeEditId));
      if (sub && (!selectedSub || String(selectedSub.id) !== String(sub.id))) {
        setSelectedSub(sub);
        setFormData({
          Customer_Id: String(sub.Customer_Id || ''),
          Customer_Name: sub.Customer_Name || '',
          Plan_Id: String(sub.Plan_Id || ''),
          Plan_Name: sub.Plan_Name || '',
          Subscription_Name: sub.Subscription_Name || '',
          No_Of_Users: String(sub.No_Of_Users || ''),
          Base_Users: String(sub.Base_Users || sub.No_Of_Users || ''),
          UnitPrice: String(sub.UnitPrice || ''),
          TaxAmount: String(sub.TaxAmount || ''),
          discount: String(sub.discount || ''),
          Server_cost: String(sub.Server_cost || ''),
          Operation_cost: String(sub.Operation_cost || ''),
          SuscriptionAmount: String(sub.SuscriptionAmount || ''),
          SubscriptionPeriod: 'Monthly',
          start_date: sub.start_date || '',
          end_date: sub.end_date || '',
          status: sub.status || 'active',
          Basestorage_Size: String(sub.Basestorage_Size || ''),
          auto_renew: sub.auto_renew !== undefined ? sub.auto_renew : true,
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, subscriptions, selectedSub]);

  const handleOpenCreate = () => {
    setSelectedSub(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push(`${basePath}/create`);
  };

  const handleOpenEdit = (sub: SubscriptionRecord) => {
    setSelectedSub(sub);
    setFormData({
      Customer_Id: String(sub.Customer_Id || ''),
      Customer_Name: sub.Customer_Name || '',
      Plan_Id: String(sub.Plan_Id || ''),
      Plan_Name: sub.Plan_Name || '',
      Subscription_Name: sub.Subscription_Name || '',
      No_Of_Users: String(sub.No_Of_Users || ''),
      Base_Users: String(sub.Base_Users || sub.No_Of_Users || ''),
      UnitPrice: String(sub.UnitPrice || ''),
      TaxAmount: String(sub.TaxAmount || ''),
      discount: String(sub.discount || ''),
      Server_cost: String(sub.Server_cost || ''),
      Operation_cost: String(sub.Operation_cost || ''),
      SuscriptionAmount: String(sub.SuscriptionAmount || ''),
      SubscriptionPeriod: 'Monthly',
      start_date: sub.start_date || '',
      end_date: sub.end_date || '',
      status: sub.status || 'active',
      Basestorage_Size: String(sub.Basestorage_Size || ''),
      auto_renew: sub.auto_renew !== undefined ? sub.auto_renew : true,
      selectedTags: [],
      notes: '',
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`${basePath}/edit/${sub.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push(basePath);
  };

  const handleOpenInvoice = (sub: SubscriptionRecord) => {
    setSelectedSub(sub);
    setIsInvoiceOpen(true);
  };

  const handleOpenDelete = (sub: SubscriptionRecord) => {
    setSelectedSub(sub);
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

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.Customer_Name.trim()) errs.Customer_Name = 'Customer tenant is required';
    if (!formData.Plan_Name.trim()) errs.Plan_Name = 'Plan selection is required';
    if (!formData.Subscription_Name.trim()) errs.Subscription_Name = 'Subscription name is required';
    if (!formData.UnitPrice) errs.UnitPrice = 'Unit price is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve the highlighted validation errors');
      return;
    }

    const payload: Partial<SubscriptionRecord> = {
      Customer_Id: formData.Customer_Id,
      Customer_Name: formData.Customer_Name,
      Plan_Id: formData.Plan_Id,
      Plan_Name: formData.Plan_Name,
      Subscription_Name: formData.Subscription_Name,
      No_Of_Users: Number(formData.No_Of_Users || 10),
      Base_Users: Number(formData.Base_Users || 10),
      UnitPrice: Number(formData.UnitPrice || 0),
      TaxAmount: Number(formData.TaxAmount || 0),
      discount: Number(formData.discount || 0),
      Server_cost: Number(formData.Server_cost || 0),
      Operation_cost: Number(formData.Operation_cost || 0),
      SuscriptionAmount: Number(formData.SuscriptionAmount || 0),
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status,
      Basestorage_Size: formData.Basestorage_Size,
      auto_renew: formData.auto_renew,
    };

    try {
      if (viewMode === 'edit' && selectedSub?.id) {
        await updateSubscription({ id: selectedSub.id, ...payload }).unwrap();
        toast.success(`Subscription "${formData.Subscription_Name}" updated successfully`);
      } else {
        await createSubscription(payload).unwrap();
        toast.success(`Subscription "${formData.Subscription_Name}" created successfully`);
      }
      handleBackToList();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSub?.id) return;
    try {
      await deleteSubscription({ id: selectedSub.id }).unwrap();
      toast.success(`Subscription "${selectedSub.Subscription_Name}" removed successfully`);
      setIsDeleteOpen(false);
      setSelectedSub(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete subscription');
    }
  };

  // Filtered subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchSearch =
        searchTerm === '' ||
        sub.Subscription_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.Customer_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.Plan_Name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'all' || sub.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchPlan =
        planFilter === 'all' || sub.Plan_Name?.toLowerCase().includes(planFilter.toLowerCase());

      return matchSearch && matchStatus && matchPlan;
    });
  }, [subscriptions, searchTerm, statusFilter, planFilter]);

  // Clean Pagination (NO rows per page dropdown)
  const totalItems = filteredSubscriptions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubscriptions.slice(start, start + itemsPerPage);
  }, [filteredSubscriptions, currentPage]);

  const handlePrintInvoice = () => {
    window.print();
  };

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
                  Sales & Billing
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Subscription' : 'Create New Subscription'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Subscription: ${formData.Subscription_Name || 'Selected Contract'}` : 'Create Commercial Subscription'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Subscription'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: TENANT & PLAN ASSIGNMENT */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TENANT & PLAN ASSIGNMENT
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="Customer_Id" className="text-xs font-semibold uppercase tracking-wider">
                      CUSTOMER TENANT <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="Customer_Id"
                      value={formData.Customer_Id}
                      onChange={(e) => handleSelectCustomer(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select Customer Account</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={String(acc.id)}>
                          {acc.Organization_Name} ({acc.Contact_Name})
                        </option>
                      ))}
                    </select>
                    {formErrors.Customer_Name && <p className="text-[11px] text-rose-500">{formErrors.Customer_Name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Plan_Id" className="text-xs font-semibold uppercase tracking-wider">
                      TARGET SUBSCRIPTION PLAN <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="Plan_Id"
                      value={formData.Plan_Id}
                      onChange={(e) => handleSelectPlan(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select Plan</option>
                      {plans.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                          {p.name} (${p.monthly_price || p.price}/mo)
                        </option>
                      ))}
                    </select>
                    {formErrors.Plan_Name && <p className="text-[11px] text-rose-500">{formErrors.Plan_Name}</p>}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Subscription_Name" className="text-xs font-semibold uppercase tracking-wider">
                      SUBSCRIPTION CONTRACT TITLE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Subscription_Name"
                      placeholder="e.g. Acme Corp Enterprise Annual Subscription"
                      value={formData.Subscription_Name}
                      onChange={(e) => setFormData({ ...formData, Subscription_Name: e.target.value })}
                      className={formErrors.Subscription_Name ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Subscription_Name && (
                      <p className="text-[11px] text-rose-500">{formErrors.Subscription_Name}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: QUOTAS & BILLING SCHEDULE */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  QUOTAS & BILLING SCHEDULE
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="No_Of_Users" className="text-xs font-semibold uppercase tracking-wider">
                      SEAT COUNT
                    </Label>
                    <Input
                      id="No_Of_Users"
                      type="number"
                      placeholder="e.g. 10"
                      value={formData.No_Of_Users}
                      onChange={(e) => setFormData({ ...formData, No_Of_Users: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Basestorage_Size" className="text-xs font-semibold uppercase tracking-wider">
                      STORAGE (GB)
                    </Label>
                    <Input
                      id="Basestorage_Size"
                      type="number"
                      placeholder="e.g. 50"
                      value={formData.Basestorage_Size}
                      onChange={(e) => setFormData({ ...formData, Basestorage_Size: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="SubscriptionPeriod" className="text-xs font-semibold uppercase tracking-wider">
                      BILLING CYCLE
                    </Label>
                    <select
                      id="SubscriptionPeriod"
                      value={formData.SubscriptionPeriod}
                      onChange={(e) => setFormData({ ...formData, SubscriptionPeriod: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {SUBSCRIPTION_PERIODS.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider">
                      CONTRACT STATUS
                    </Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="start_date" className="text-xs font-semibold uppercase tracking-wider">
                      START DATE
                    </Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="end_date" className="text-xs font-semibold uppercase tracking-wider">
                      EXPIRATION DATE
                    </Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="auto_renew"
                    checked={formData.auto_renew}
                    onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <Label htmlFor="auto_renew" className="text-xs font-medium cursor-pointer">
                    Automatically generate renewal invoice 15 days before expiration
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: FINANCIAL BREAKDOWN */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  FINANCIAL BREAKDOWN & COST ALLOCATION
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="UnitPrice" className="text-xs font-semibold uppercase tracking-wider">
                      BASE UNIT PRICE ($) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="UnitPrice"
                      type="number"
                      placeholder="e.g. 99"
                      value={formData.UnitPrice}
                      onChange={(e) => setFormData({ ...formData, UnitPrice: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="TaxAmount" className="text-xs font-semibold uppercase tracking-wider">
                      TAX AMOUNT ($)
                    </Label>
                    <Input
                      id="TaxAmount"
                      type="number"
                      placeholder="e.g. 18"
                      value={formData.TaxAmount}
                      onChange={(e) => setFormData({ ...formData, TaxAmount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Server_cost" className="text-xs font-semibold uppercase tracking-wider">
                      SERVER COST ($)
                    </Label>
                    <Input
                      id="Server_cost"
                      type="number"
                      placeholder="e.g. 15"
                      value={formData.Server_cost}
                      onChange={(e) => setFormData({ ...formData, Server_cost: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Operation_cost" className="text-xs font-semibold uppercase tracking-wider">
                      OPS COST ($)
                    </Label>
                    <Input
                      id="Operation_cost"
                      type="number"
                      placeholder="e.g. 10"
                      value={formData.Operation_cost}
                      onChange={(e) => setFormData({ ...formData, Operation_cost: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="discount" className="text-xs font-semibold uppercase tracking-wider">
                      DISCOUNT ($)
                    </Label>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="e.g. 0"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Total Calculated Subscription Amount:
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (Base + Tax + Server + Ops) - Discount
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${formData.SuscriptionAmount || '0'}
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
                  CONTRACT SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {formData.Customer_Name || 'Not Selected'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {formData.Plan_Name || 'Not Selected'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Billing:</span>
                  <span className="font-semibold text-foreground">{formData.SubscriptionPeriod}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-blue-600 text-sm">
                    ${formData.SuscriptionAmount || '0'}
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
                  CONTRACT & AUDIT NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Billing terms, custom SLAs, or contract renewal notes..."
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Subscriptions Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage active client licenses, billing dates, tax breakdowns, cost structures, and invoice generation.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            New Subscription
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="shadow-xs border-slate-200 dark:border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by contract name, customer, or plan..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium"
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                value={planFilter}
                onChange={(e) => {
                  setPlanFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium"
              >
                <option value="all">All Plans</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              {(searchTerm || statusFilter !== 'all' || planFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPlanFilter('all');
                    setCurrentPage(1);
                  }}
                  className="h-9 text-xs cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Data Table */}
      <Card className="shadow-xs border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-50/70 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Subscription Contract</th>
                <th className="py-3 px-4">Customer Tenant</th>
                <th className="py-3 px-4">Assigned Plan</th>
                <th className="py-3 px-4">Users & Storage</th>
                <th className="py-3 px-4">Amount & Tax</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading subscriptions from SuperAdmin backend...
                  </td>
                </tr>
              ) : paginatedSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <CreditCard className="h-10 w-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    No subscriptions found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedSubscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
                          {((sub.Subscription_Name || (sub as any).Customer_Name || 'SB').slice(0, 2)).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {sub.Subscription_Name || (sub as any).Customer_Name || 'Subscription'}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            ID: {sub.Subscription_Id || `SUB-${sub.id}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {sub.Customer_Name}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Start: {sub.start_date || 'N/A'} • End: {sub.end_date || 'Auto-renew'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="font-medium text-xs">
                        {sub.Plan_Name}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs flex items-center gap-2">
                        <span className="flex items-center gap-1 font-medium text-slate-900 dark:text-slate-100">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {sub.No_Of_Users || 10} Users
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {sub.Basestorage_Size || 50} GB
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        ${sub.SuscriptionAmount || sub.UnitPrice || 0}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Unit: ${sub.UnitPrice || 0} • Tax: ${sub.TaxAmount || 0}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        className={`text-xs ${
                          sub.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                            : sub.status === 'trial'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200'
                        }`}
                      >
                        {(sub.status || 'active').toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenInvoice(sub)}
                          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-blue-600"
                          title="View Invoice & Details"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(sub)}
                          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-blue-600"
                          title="Edit Subscription"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(sub)}
                          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-rose-600"
                          title="Delete Subscription"
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

        {/* Clean Footer Pagination without rows-per-page */}
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
      </Card>

      {/* INVOICE & SUBSCRIPTION DETAILS MODAL */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Subscription Invoice: INV-{selectedSub?.id || '101'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintInvoice}
                className="gap-1.5 text-xs cursor-pointer mr-6"
              >
                <Printer className="h-3.5 w-3.5" />
                Print / PDF
              </Button>
            </DialogTitle>
            <DialogDescription>
              Official billing breakdown generated for {selectedSub?.Customer_Name}.
            </DialogDescription>
          </DialogHeader>

          {selectedSub && (
            <div className="space-y-6 py-2 border rounded-xl p-6 bg-white dark:bg-slate-900 shadow-xs">
              {/* Invoice Brand Header */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <img src="/logo_blue.png" alt="Pegatto" className="h-8 w-auto object-contain" />
                    <span className="font-bold text-lg text-slate-900 dark:text-slate-100">PEGATTO</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">SuperAdmin Platform Services Ltd.</p>
                  <p className="text-xs text-muted-foreground">Tax ID / GST: 29ABCDE1234F1Z5</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 mb-1">
                    {(selectedSub.status || 'active').toUpperCase()}
                  </Badge>
                  <div className="text-xs text-muted-foreground">Invoice Date: {selectedSub.start_date || '2026-11-17'}</div>
                  <div className="text-xs text-muted-foreground">Due Date: {selectedSub.end_date || 'Auto-renew'}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Billed To:
                  </span>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{selectedSub.Customer_Name}</p>
                  <p className="text-muted-foreground">Contract: {selectedSub.Subscription_Name}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Service Plan:
                  </span>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{selectedSub.Plan_Name}</p>
                  <p className="text-muted-foreground">{selectedSub.No_Of_Users || 10} User Licenses • {selectedSub.Basestorage_Size || 50} GB Storage</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b">
                    <tr>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-center">Seats</th>
                      <th className="py-2 px-3 text-right">Rate</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2.5 px-3 font-medium">{selectedSub.Plan_Name} Monthly Tier</td>
                      <td className="py-2.5 px-3 text-center">{selectedSub.No_Of_Users || 10}</td>
                      <td className="py-2.5 px-3 text-right">${selectedSub.UnitPrice || 99}</td>
                      <td className="py-2.5 px-3 text-right font-semibold">${selectedSub.UnitPrice || 99}</td>
                    </tr>
                    {selectedSub.Server_cost ? (
                      <tr>
                        <td className="py-2 px-3 text-muted-foreground">Dedicated Telemetry & Server Allocation</td>
                        <td className="py-2 px-3 text-center">1</td>
                        <td className="py-2 px-3 text-right">${selectedSub.Server_cost}</td>
                        <td className="py-2 px-3 text-right font-semibold">${selectedSub.Server_cost}</td>
                      </tr>
                    ) : null}
                    {selectedSub.TaxAmount ? (
                      <tr>
                        <td className="py-2 px-3 text-muted-foreground">Standard Applicable Tax & Surcharge</td>
                        <td className="py-2 px-3 text-center">-</td>
                        <td className="py-2 px-3 text-right">${selectedSub.TaxAmount}</td>
                        <td className="py-2 px-3 text-right font-semibold">${selectedSub.TaxAmount}</td>
                      </tr>
                    ) : null}
                  </tbody>
                  <tfoot className="border-t bg-slate-50/50 dark:bg-slate-800/50">
                    <tr>
                      <td colSpan={3} className="py-2 px-3 text-right font-bold text-sm">
                        Total Amount Due:
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-sm text-blue-600">
                        ${selectedSub.SuscriptionAmount || selectedSub.UnitPrice || 0}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvoiceOpen(false)} className="cursor-pointer">
              Close
            </Button>
            <Button
              onClick={() => {
                setIsInvoiceOpen(false);
                if (selectedSub) handleOpenEdit(selectedSub);
              }}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            >
              Edit Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete Subscription: ${selectedSub?.Subscription_Name}`}
        description="Are you sure you want to terminate and delete this subscription contract? This action will immediately revoke user seat access."
        isLoading={isDeleting}
      />
    </div>
  );
}
