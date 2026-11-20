'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  FileText,
  Search,
  Filter,
  RefreshCw,
  Download,
  DollarSign,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  CreditCard,
  Plus,
  ArrowLeft,
  Save,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  useGetInvoicesListQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useGetAccountsListQuery,
  useGetSubscriptionsListQuery,
  InvoiceRecord,
} from '@/service/api/superAdminService';

export default function InvoicesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: invoices = [], isLoading, refetch, isFetching } = useGetInvoicesListQuery();
  const { data: accounts = [], refetch: refetchAccounts } = useGetAccountsListQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: subscriptions = [], refetch: refetchSubscriptions } = useGetSubscriptionsListQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  // Re-fetch master data immediately when entering Create or Edit mode
  useEffect(() => {
    if (viewMode === 'create' || viewMode === 'edit') {
      refetchAccounts();
      refetchSubscriptions();
    }
  }, [viewMode, refetchAccounts, refetchSubscriptions]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Form State - strictly blank initial state
  const initialForm = {
    Invoice_Id: '',
    Invoice_Date: new Date().toISOString().split('T')[0],
    Customer_Name: '',
    Subscription_Name: 'Enterprise Cloud SaaS',
    InvoiceAmount: '',
    TaxAmount: '',
    NetAmount: '',
    Is_Archived: false,
    Payment_Method: 'Wire Transfer / ACH',
    Notes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  // Auto-populate formData when directly visiting or refreshing on an edit page (/sales/invoices/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && invoices.length > 0) {
      const inv = invoices.find((i: any) => String(i.id) === String(routeEditId) || String(i.Invoice_Id) === String(routeEditId));
      if (inv && (!selectedInvoice || String(selectedInvoice.id) !== String(inv.id))) {
        setSelectedInvoice(inv);
        setFormData({
          Invoice_Id: inv.Invoice_Id || '',
          Invoice_Date: inv.Invoice_Date ? inv.Invoice_Date.split('T')[0] : '',
          Customer_Name: inv.Customer_Name || '',
          Subscription_Name: inv.Subscription_Name || '',
          InvoiceAmount: String(inv.InvoiceAmount || ''),
          TaxAmount: String(inv.TaxAmount || ''),
          NetAmount: String(inv.NetAmount || ''),
          Is_Archived: Boolean(inv.Is_Archived),
          Payment_Method: 'Wire Transfer / ACH',
          Notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, invoices, selectedInvoice]);

  const handleOpenCreate = () => {
    setSelectedInvoice(null);
    setFormData({
      ...initialForm,
      Invoice_Id: `INV-${Date.now().toString().slice(-6)}`,
    });
    setInternalViewMode('create');
    router.push('/sales/invoices/create');
  };

  const handleOpenEdit = (inv: InvoiceRecord) => {
    setSelectedInvoice(inv);
    setFormData({
      Invoice_Id: inv.Invoice_Id || '',
      Invoice_Date: inv.Invoice_Date ? inv.Invoice_Date.split('T')[0] : '',
      Customer_Name: inv.Customer_Name || '',
      Subscription_Name: inv.Subscription_Name || '',
      InvoiceAmount: String(inv.InvoiceAmount || ''),
      TaxAmount: String(inv.TaxAmount || ''),
      NetAmount: String(inv.NetAmount || ''),
      Is_Archived: Boolean(inv.Is_Archived),
      Payment_Method: 'Wire Transfer / ACH',
      Notes: '',
    });
    setInternalViewMode('edit');
    router.push(`/sales/invoices/edit/${inv.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/sales/invoices');
  };

  const handleOpenView = (inv: InvoiceRecord) => {
    setSelectedInvoice(inv);
    setIsViewOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const customerSubscriptions = useMemo(() => {
    if (!formData.Customer_Name) return subscriptions;
    return subscriptions.filter((s: any) =>
      (s.Customer_Name && s.Customer_Name.toLowerCase() === formData.Customer_Name.toLowerCase()) ||
      (s.customer_name && s.customer_name.toLowerCase() === formData.Customer_Name.toLowerCase())
    );
  }, [formData.Customer_Name, subscriptions]);

  const handleSelectCustomer = (customerName: string) => {
    setFormData((prev) => ({
      ...prev,
      Customer_Name: customerName,
      Subscription_Name: '',
      InvoiceAmount: '',
      TaxAmount: '',
      NetAmount: '',
    }));
  };

  const handleSelectSubscription = (subId: string) => {
    const sub = subscriptions.find((s: any) => String(s.id) === subId || String(s.Subscription_Id) === subId);
    if (sub) {
      const base = Number(sub.SuscriptionAmount || sub.UnitPrice || 0);
      const tax = Number(sub.TaxAmount || 0);
      setFormData((prev) => ({
        ...prev,
        Subscription_Name: sub.Subscription_Name || sub.Plan_Name || '',
        Customer_Name: prev.Customer_Name || sub.Customer_Name || (sub as any).customer_name || '',
        InvoiceAmount: String(base),
        TaxAmount: String(tax),
        NetAmount: String(base + tax),
      }));
    }
  };

  const handleCalculateNet = (base: string, tax: string) => {
    const b = Number(base) || 0;
    const t = Number(tax) || 0;
    setFormData((prev) => ({
      ...prev,
      InvoiceAmount: base,
      TaxAmount: tax,
      NetAmount: b + t > 0 ? String(b + t) : '',
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Customer_Name.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (!formData.InvoiceAmount || Number(formData.InvoiceAmount) <= 0) {
      toast.error('Invoice amount must be greater than zero');
      return;
    }

    try {
      const payload: Partial<InvoiceRecord> = {
        Invoice_Id: formData.Invoice_Id.trim(),
        Invoice_Date: formData.Invoice_Date,
        Customer_Name: formData.Customer_Name.trim(),
        Subscription_Name: formData.Subscription_Name.trim(),
        InvoiceAmount: Number(formData.InvoiceAmount),
        TaxAmount: Number(formData.TaxAmount) || 0,
        NetAmount: Number(formData.NetAmount) || Number(formData.InvoiceAmount),
        Is_Archived: formData.Is_Archived,
      };

      if (viewMode === 'edit' && selectedInvoice?.id) {
        await updateInvoice({ id: selectedInvoice.id, ...payload }).unwrap();
        toast.success(`Invoice "${formData.Invoice_Id}" updated successfully`);
      } else {
        await createInvoice(payload).unwrap();
        toast.success(`Invoice "${formData.Invoice_Id}" created successfully`);
      }
      handleBackToList();
      refetch();
    } catch {
      toast.error('Failed to save invoice record');
    }
  };

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        searchTerm === '' ||
        inv.Invoice_Id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.Customer_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.Subscription_Name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'paid' && inv.Is_Archived === true) ||
        (statusFilter === 'pending' && !inv.Is_Archived);

      return matchSearch && matchStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const totalRecords = filteredInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) {
      toast.info('No invoices to export');
      return;
    }
    const headers = ['Invoice ID', 'Date', 'Customer', 'Subscription', 'Invoice Amount', 'Tax Amount', 'Net Amount', 'Status'];
    const rows = filteredInvoices.map((i) => [
      i.Invoice_Id,
      i.Invoice_Date,
      `"${i.Customer_Name || ''}"`,
      `"${i.Subscription_Name || ''}"`,
      i.InvoiceAmount,
      i.TaxAmount || 0,
      i.NetAmount,
      i.Is_Archived ? 'Paid' : 'Pending',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <span className="hover:underline cursor-pointer" onClick={handleBackToList}>
                  Sales Invoices
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Invoice: ${formData.Invoice_Id}` : 'Generate Commercial Sales Invoice'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Generate Invoice'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: INVOICE & CUSTOMER SPECIFICATIONS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  INVOICE & CUSTOMER SPECIFICATIONS
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="Invoice_Id" className="text-xs font-semibold uppercase tracking-wider">
                      INVOICE NUMBER <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Invoice_Id"
                      value={formData.Invoice_Id}
                      onChange={(e) => setFormData({ ...formData, Invoice_Id: e.target.value })}
                      className="font-mono text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Invoice_Date" className="text-xs font-semibold uppercase tracking-wider">
                      INVOICE DATE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Invoice_Date"
                      type="date"
                      value={formData.Invoice_Date}
                      onChange={(e) => setFormData({ ...formData, Invoice_Date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Customer_Name" className="text-xs font-semibold uppercase tracking-wider">
                      CUSTOMER TENANT <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="Customer_Name"
                      value={formData.Customer_Name}
                      onChange={(e) => handleSelectCustomer(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select Customer Account</option>
                      {accounts.map((acc) => {
                        const name = acc.Organization_Name || acc.Contact_Name;
                        return (
                          <option key={acc.id} value={name}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Subscription_Name" className="text-xs font-semibold uppercase tracking-wider">
                      SUBSCRIPTION CONTRACT / PLAN
                    </Label>
                    <select
                      id="Subscription_Name"
                      value={customerSubscriptions.find((s: any) => s.Subscription_Name === formData.Subscription_Name)?.id || ''}
                      onChange={(e) => handleSelectSubscription(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Select Active Subscription</option>
                      {customerSubscriptions.map((sub: any) => (
                        <option key={sub.id} value={String(sub.id)}>
                          {sub.Subscription_Name || sub.Plan_Name} (${sub.SuscriptionAmount || sub.UnitPrice || 0})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: COMMERCIAL AMOUNTS & TAXATION */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  COMMERCIAL AMOUNTS & TAXATION
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="InvoiceAmount" className="text-xs font-semibold uppercase tracking-wider">
                      BASE AMOUNT ($) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="InvoiceAmount"
                      type="number"
                      placeholder="e.g. 5000"
                      value={formData.InvoiceAmount}
                      onChange={(e) => handleCalculateNet(e.target.value, formData.TaxAmount)}
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
                      placeholder="e.g. 900"
                      value={formData.TaxAmount}
                      onChange={(e) => handleCalculateNet(formData.InvoiceAmount, e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="NetAmount" className="text-xs font-semibold uppercase tracking-wider">
                      NET TOTAL AMOUNT ($)
                    </Label>
                    <Input
                      id="NetAmount"
                      type="number"
                      placeholder="Auto-calculated"
                      value={formData.NetAmount}
                      onChange={(e) => setFormData({ ...formData, NetAmount: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: SETTLEMENT STATUS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  SETTLEMENT STATUS
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="Is_Archived"
                    checked={formData.Is_Archived}
                    onChange={(e) => setFormData({ ...formData, Is_Archived: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="Is_Archived" className="cursor-pointer text-xs font-medium">
                    Invoice Paid & Settled
                  </Label>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  When marked as paid, this invoice appears as settled in the Payment Dashboard ledger.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: INVOICE MEMO & NOTES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  INVOICE MEMO & REMARKS
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Payment instructions, bank routing details, or customer PO reference..."
                  rows={4}
                  value={formData.Notes}
                  onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
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
  // DEFAULT TABLE LIST VIEW (NO KPI CARDS)
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Sales Invoices
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Commercial billing ledger: audit tenant invoices, tax statements, and payment settlements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={handleOpenCreate}
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number, customer, or plan..."
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
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="all">All Invoices</option>
                <option value="paid">Paid & Settled</option>
                <option value="pending">Pending Payment</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Data Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer Tenant</th>
                <th className="py-3 px-4">Contract Plan</th>
                <th className="py-3 px-4">Amounts (Base & Tax)</th>
                <th className="py-3 px-4">Net Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading commercial invoices...
                  </td>
                </tr>
              ) : paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                    No invoices found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-blue-600">
                      {inv.Invoice_Id}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      {inv.Invoice_Date ? inv.Invoice_Date.split('T')[0] : '—'}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {inv.Customer_Name}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      {inv.Subscription_Name || 'Enterprise Plan'}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div>${Number(inv.InvoiceAmount || 0).toLocaleString()}</div>
                      <div className="text-[11px] text-muted-foreground">+ ${Number(inv.TaxAmount || 0).toLocaleString()} tax</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-foreground">
                      ${Number(inv.NetAmount || inv.InvoiceAmount || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {inv.Is_Archived ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-500/20 text-xs">
                          Pending
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenView(inv)}
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(inv)}
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          title="Edit Invoice"
                        >
                          <Edit2 className="h-4 w-4" />
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

      {/* VIEW INVOICE DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Invoice {selectedInvoice?.Invoice_Id}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs mr-6"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Statement
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 pt-2 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-muted/30 p-4 rounded-xl border border-border">
                <div>
                  <span className="text-xs text-muted-foreground block">Customer</span>
                  <span className="font-semibold text-foreground">{selectedInvoice.Customer_Name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Contract</span>
                  <span className="font-semibold text-foreground">{selectedInvoice.Subscription_Name || 'Enterprise'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Invoice Date</span>
                  <span className="font-semibold text-foreground">{selectedInvoice.Invoice_Date?.split('T')[0]}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Payment Status</span>
                  <span className="font-semibold text-foreground">{selectedInvoice.Is_Archived ? 'Settled / Paid' : 'Pending'}</span>
                </div>
              </div>

              <div className="border border-border rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Base Commercial Amount</span>
                  <span>${Number(selectedInvoice.InvoiceAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Applicable Tax</span>
                  <span>+ ${Number(selectedInvoice.TaxAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border">
                  <span>Net Amount</span>
                  <span>${Number(selectedInvoice.NetAmount || selectedInvoice.InvoiceAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setIsViewOpen(false);
                if (selectedInvoice) handleOpenEdit(selectedInvoice);
              }}
            >
              Edit This Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
