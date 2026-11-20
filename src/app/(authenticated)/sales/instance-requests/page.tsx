'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  Server,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Building2,
  Layers,
  Sparkles,
  ArrowLeft,
  Save,
  Globe,
  DollarSign,
  ChevronLeft,
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
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetInstanceRequestsListQuery,
  useCreateInstanceRequestMutation,
  useUpdateInstanceRequestMutation,
  useDeleteInstanceRequestMutation,
  useGetPaymentsFullListQuery,
  useGetInvoiceFullListQuery,
  InstanceRequestRecord,
} from '@/service/api/superAdminService';

interface FormData {
  id?: string | number;
  RequestId?: string;
  InstanceName: string;
  RequestDate: string;
  InvoiceNo: string;
  InvoiceId?: string | number;
  CustomerName: string;
  PlanName: string;
  planid?: string | number;
  NoofUsers: number | string;
  SubscriptionId: string;
  Subscription_Id?: string | number;
  Amount: number | string;
  Url: string;
  product_type: string;
  notes?: string;
}

const INITIAL_FORM: FormData = {
  InstanceName: '',
  RequestDate: new Date().toISOString().split('T')[0],
  InvoiceNo: '',
  CustomerName: '',
  PlanName: '',
  NoofUsers: '',
  SubscriptionId: '',
  Amount: '',
  Url: '',
  product_type: '',
  notes: '',
};

export default function InstanceRequestsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: requests = [], isLoading, refetch, isFetching } = useGetInstanceRequestsListQuery();
  const { data: payments = [], refetch: refetchPayments } = useGetPaymentsFullListQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: invoices = [], refetch: refetchInvoices } = useGetInvoiceFullListQuery(undefined, { refetchOnMountOrArgChange: true });

  const [createRequest, { isLoading: isCreating }] = useCreateInstanceRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] = useUpdateInstanceRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteInstanceRequestMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  // Re-fetch master data immediately when entering Create or Edit mode
  useEffect(() => {
    if (viewMode === 'create' || viewMode === 'edit') {
      refetchPayments();
      refetchInvoices();
    }
  }, [viewMode, refetchPayments, refetchInvoices]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'provisioned'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [viewRecord, setViewRecord] = useState<InstanceRequestRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Prepare invoice options from payments or invoices
  const invoiceOptions = useMemo(() => {
    const list: Array<{
      invoiceNo: string;
      invoiceId: any;
      customerName: string;
      planName: string;
      planId?: any;
      noOfUsers: number;
      subscriptionId: string;
      subDbId?: any;
      amount: number;
    }> = [];

    const seen = new Set<string>();

    payments.forEach((p) => {
      const invNo = p.Invoice_Number || p.Invoice_No;
      if (invNo && !seen.has(invNo)) {
        seen.add(invNo);
        list.push({
          invoiceNo: invNo,
          invoiceId: p.Invoice_id || p.id,
          customerName: p.Customer_Name || '',
          planName: p.Subscription_Name || 'Enterprise Cloud',
          planId: 1,
          noOfUsers: p.NoofUsers || 10,
          subscriptionId: p.Subscription_Id ? String(p.Subscription_Id) : 'SUB-2026-001',
          subDbId: p.Subscription_id || 1,
          amount: p.Total_Amount || p.Amount || 0,
        });
      }
    });

    invoices.forEach((inv) => {
      const invNo = inv.Invoice_Id;
      if (invNo && !seen.has(invNo)) {
        seen.add(invNo);
        list.push({
          invoiceNo: invNo,
          invoiceId: inv.id,
          customerName: inv.Customer_Name || '',
          planName: inv.Subscription_Name || 'Standard SaaS',
          planId: 1,
          noOfUsers: 10,
          subscriptionId: 'SUB-2026-001',
          amount: inv.NetAmount || inv.InvoiceAmount || 0,
        });
      }
    });

    return list;
  }, [payments, invoices]);

  const handleSelectInvoice = (invoiceNo: string) => {
    const found = invoiceOptions.find((i) => i.invoiceNo === invoiceNo);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        InvoiceNo: found.invoiceNo,
        InvoiceId: found.invoiceId,
        CustomerName: found.customerName,
        PlanName: found.planName,
        planid: found.planId,
        NoofUsers: found.noOfUsers,
        SubscriptionId: found.subscriptionId,
        Subscription_Id: found.subDbId,
        Amount: found.amount,
        Url: prev.InstanceName ? `https://${prev.InstanceName.toLowerCase().replace(/[^a-z0-9]/g, '')}.crmfarm.app` : prev.Url,
      }));
    } else {
      setFormData((prev) => ({ ...prev, InvoiceNo: invoiceNo }));
    }
  };

  const handleInstanceNameChange = (name: string) => {
    const cleanSub = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanUrl = cleanSub ? `https://${cleanSub}.crmfarm.app` : '';
    setFormData((prev) => ({
      ...prev,
      InstanceName: name,
      Url: cleanUrl,
    }));
  };

  // Auto-populate formData when directly visiting or refreshing on an edit page (/sales/instance-requests/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && requests.length > 0) {
      const req = requests.find((r: any) => String(r.id) === String(routeEditId) || String(r.RequestId) === String(routeEditId));
      if (req && (!formData.id || String(formData.id) !== String(req.id))) {
        setFormData({
          id: req.id,
          RequestId: req.RequestId,
          InstanceName: req.InstanceName || '',
          RequestDate: req.RequestDate ? req.RequestDate.split('T')[0] : '',
          InvoiceNo: req.InvoiceNo || '',
          CustomerName: req.CustomerName || '',
          PlanName: req.PlanName || '',
          NoofUsers: req.NoofUsers || '',
          SubscriptionId: req.SubscriptionId || '',
          Amount: req.Amount || '',
          Url: req.Url || '',
          product_type: req.product_type || '',
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, requests, formData.id]);

  const handleOpenCreate = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setInternalViewMode('create');
    router.push('/sales/instance-requests/create');
  };

  const handleOpenEdit = (req: InstanceRequestRecord) => {
    setFormData({
      id: req.id,
      RequestId: req.RequestId,
      InstanceName: req.InstanceName || '',
      RequestDate: req.RequestDate ? req.RequestDate.split('T')[0] : '',
      InvoiceNo: req.InvoiceNo || '',
      CustomerName: req.CustomerName || '',
      PlanName: req.PlanName || '',
      NoofUsers: req.NoofUsers || '',
      SubscriptionId: req.SubscriptionId || '',
      Amount: req.Amount || '',
      Url: req.Url || '',
      product_type: req.product_type || '',
      notes: '',
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`/sales/instance-requests/edit/${req.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/sales/instance-requests');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.InstanceName.trim()) errs.InstanceName = 'Instance name is required';
    if (!formData.RequestDate) errs.RequestDate = 'Request date is required';
    if (!formData.CustomerName.trim()) errs.CustomerName = 'Customer name is required';
    if (!formData.PlanName.trim()) errs.PlanName = 'Plan name is required';
    if (!formData.NoofUsers || Number(formData.NoofUsers) <= 0) errs.NoofUsers = 'Number of users must be > 0';
    if (!formData.SubscriptionId.trim()) errs.SubscriptionId = 'Subscription ID is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all mandatory fields correctly');
      return;
    }

    try {
      const payload: Partial<InstanceRequestRecord> = {
        InstanceName: formData.InstanceName.trim(),
        RequestDate: formData.RequestDate,
        InvoiceNo: formData.InvoiceNo,
        CustomerName: formData.CustomerName.trim(),
        PlanName: formData.PlanName.trim(),
        NoofUsers: Number(formData.NoofUsers) || 1,
        SubscriptionId: formData.SubscriptionId.trim(),
        Amount: Number(formData.Amount) || 0,
        Url: formData.Url || `https://${formData.InstanceName.toLowerCase().replace(/[^a-z0-9]/g, '')}.crmfarm.app`,
        product_type: formData.product_type || 'CRM SaaS',
      };

      if (viewMode === 'edit' && formData.id) {
        await updateRequest({ id: formData.id, ...payload }).unwrap();
        toast.success(`Instance request "${formData.InstanceName}" updated successfully`);
      } else {
        await createRequest(payload).unwrap();
        toast.success(`Instance request "${formData.InstanceName}" created successfully`);
      }
      handleBackToList();
      refetch();
    } catch {
      toast.error('Failed to save instance request');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteRequest({ id: deleteId }).unwrap();
      toast.success('Instance request deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Failed to delete instance request');
    }
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (r.InstanceName || '').toLowerCase().includes(q) ||
        (r.CustomerName || '').toLowerCase().includes(q) ||
        (r.InvoiceNo || '').toLowerCase().includes(q) ||
        (r.RequestId || '').toLowerCase().includes(q) ||
        (r.PlanName || '').toLowerCase().includes(q);

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'provisioned' && r.InstanceCreatedFlag) ||
        (statusFilter === 'pending' && !r.InstanceCreatedFlag);

      return matchSearch && matchStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const totalRecords = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE / EDIT VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <form onSubmit={handleSave} className="space-y-6">
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
                  Instance Requests
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Request' : 'Create New Request'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Instance Request: ${formData.InstanceName}` : 'Create New Instance Request'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Request'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: INSTANCE & DEPLOYMENT SPECIFICATIONS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  INSTANCE & DEPLOYMENT SPECIFICATIONS
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="InstanceName" className="text-xs font-semibold uppercase tracking-wider">
                      INSTANCE NAME (SUBDOMAIN) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="InstanceName"
                      placeholder="e.g. acmecloud"
                      value={formData.InstanceName}
                      onChange={(e) => handleInstanceNameChange(e.target.value)}
                      className={formErrors.InstanceName ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.InstanceName && (
                      <p className="text-[11px] text-rose-500">{formErrors.InstanceName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Url" className="text-xs font-semibold uppercase tracking-wider">
                      DEPLOYMENT URL
                    </Label>
                    <Input
                      id="Url"
                      placeholder="https://acmecloud.crmfarm.app"
                      value={formData.Url}
                      onChange={(e) => setFormData({ ...formData, Url: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="RequestDate" className="text-xs font-semibold uppercase tracking-wider">
                      REQUEST DATE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="RequestDate"
                      type="date"
                      value={formData.RequestDate}
                      onChange={(e) => setFormData({ ...formData, RequestDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="product_type" className="text-xs font-semibold uppercase tracking-wider">
                      PRODUCT TYPE
                    </Label>
                    <Input
                      id="product_type"
                      placeholder="e.g. CRM SaaS or ERP Core"
                      value={formData.product_type}
                      onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: SUBSCRIPTION & COMMERCIAL LINKAGE */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  SUBSCRIPTION & COMMERCIAL LINKAGE
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="InvoiceNo" className="text-xs font-semibold uppercase tracking-wider">
                    SELECT ASSOCIATED INVOICE
                  </Label>
                  <select
                    id="InvoiceNo"
                    value={formData.InvoiceNo}
                    onChange={(e) => handleSelectInvoice(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">-- Choose an Invoice to Auto-populate Customer & Plan --</option>
                    {invoiceOptions.map((opt) => (
                      <option key={opt.invoiceNo} value={opt.invoiceNo}>
                        {opt.invoiceNo} - {opt.customerName} (${opt.amount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="CustomerName" className="text-xs font-semibold uppercase tracking-wider">
                      CUSTOMER NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="CustomerName"
                      placeholder="Enter customer organization"
                      value={formData.CustomerName}
                      onChange={(e) => setFormData({ ...formData, CustomerName: e.target.value })}
                      className={formErrors.CustomerName ? 'border-rose-500' : ''}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="PlanName" className="text-xs font-semibold uppercase tracking-wider">
                      PLAN NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="PlanName"
                      placeholder="e.g. Enterprise Cloud"
                      value={formData.PlanName}
                      onChange={(e) => setFormData({ ...formData, PlanName: e.target.value })}
                      className={formErrors.PlanName ? 'border-rose-500' : ''}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="NoofUsers" className="text-xs font-semibold uppercase tracking-wider">
                      NUMBER OF USERS <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="NoofUsers"
                      type="number"
                      placeholder="e.g. 25"
                      value={formData.NoofUsers}
                      onChange={(e) => setFormData({ ...formData, NoofUsers: e.target.value })}
                      className={formErrors.NoofUsers ? 'border-rose-500' : ''}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="SubscriptionId" className="text-xs font-semibold uppercase tracking-wider">
                      SUBSCRIPTION ID <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="SubscriptionId"
                      placeholder="e.g. SUB-2026-001"
                      value={formData.SubscriptionId}
                      onChange={(e) => setFormData({ ...formData, SubscriptionId: e.target.value })}
                      className={formErrors.SubscriptionId ? 'border-rose-500' : ''}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Amount" className="text-xs font-semibold uppercase tracking-wider">
                      TOTAL AMOUNT ($)
                    </Label>
                    <Input
                      id="Amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.Amount}
                      onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: PROVISIONING STATUS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  PROVISIONING STATUS
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium text-foreground">
                    Awaiting SuperAdmin Provisioning
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Upon saving, this request appears in the Instance Creation queue with pre-mapped database parameters.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: DEPLOYMENT NOTES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  DEPLOYMENT NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Record edge certificate needs, dedicated DB cluster requirements, or regional affinity..."
                  rows={4}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="text-xs leading-relaxed"
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
              <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Instance Requests
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Track customer tenant deployment orders, provisioned cloud instances, and billing references
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
            New Instance Request
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by instance, customer, or invoice..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
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
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="all">All Deployment States</option>
                <option value="pending">Pending Provisioning</option>
                <option value="provisioned">Provisioned & Live</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instance Requests Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Instance / Subdomain</th>
                <th className="py-3 px-4">Customer Tenant</th>
                <th className="py-3 px-4">Subscription & Plan</th>
                <th className="py-3 px-4">Users & Amount</th>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading deployment requests...
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Server className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                    No instance requests found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Server className="h-4 w-4 text-blue-600" />
                        <span>{req.InstanceName}</span>
                      </div>
                      {req.Url && (
                        <a
                          href={req.Url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Globe className="h-3 w-3" />
                          {req.Url}
                        </a>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{req.CustomerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {req.RequestDate ? req.RequestDate.split('T')[0] : '—'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{req.PlanName}</div>
                      <div className="font-mono text-xs text-muted-foreground">{req.SubscriptionId}</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-semibold text-foreground">${Number(req.Amount || 0).toLocaleString()}</div>
                      <div className="text-muted-foreground">{req.NoofUsers} User Seats</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                      {req.InvoiceNo || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {req.InstanceCreatedFlag ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-500/20 text-xs">
                          Pending
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!req.InstanceCreatedFlag && (
                          <Link
                            href={`/sales/instance-creation?requestId=${req.RequestId || req.id}`}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                            title="Provision Instance Now"
                          >
                            <Sparkles className="h-4 w-4" />
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewRecord(req)}
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(req)}
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          title="Edit Request"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeleteId(req.id);
                            setIsDeleteDialogOpen(true);
                          }}
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

        {/* Clean Footer Pagination (NO Rows per page selector) */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold text-foreground">{Math.min(currentPage * itemsPerPage, totalRecords)}</span> of{' '}
            <span className="font-semibold text-foreground">{totalRecords}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* VIEW MODAL */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              {viewRecord?.InstanceName}
            </DialogTitle>
            <DialogDescription>
              Deployment parameters and subscription references
            </DialogDescription>
          </DialogHeader>

          {viewRecord && (
            <div className="space-y-4 pt-2 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-muted/30 p-4 rounded-xl border border-border">
                <div>
                  <span className="text-xs text-muted-foreground block">Customer</span>
                  <span className="font-semibold text-foreground">{viewRecord.CustomerName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Plan</span>
                  <span className="font-semibold text-foreground">{viewRecord.PlanName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Subscription ID</span>
                  <span className="font-mono text-xs font-semibold text-foreground">{viewRecord.SubscriptionId}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Invoice No</span>
                  <span className="font-mono text-xs font-semibold text-foreground">{viewRecord.InvoiceNo || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Users</span>
                  <span className="font-semibold text-foreground">{viewRecord.NoofUsers} Seats</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Total Amount</span>
                  <span className="font-semibold text-foreground">${viewRecord.Amount}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewRecord(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Instance Request"
        description="Are you sure you want to delete this tenant deployment request?"
      />
    </div>
  );
}
