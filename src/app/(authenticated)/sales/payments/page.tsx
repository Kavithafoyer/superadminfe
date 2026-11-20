'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
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
  ShieldCheck,
  Trash2,
  Receipt,
  ArrowRight,
  ArrowLeft,
  Save,
  Tag,
  Hash,
  ChevronLeft,
  ChevronRight,
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
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetPaymentsListQuery,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useGetInvoiceFullListQuery,
  useGetAccountsListQuery,
  PaymentRecord,
} from '@/service/api/superAdminService';

const PAYMENT_MODES = ['Online', 'Cash', 'UPI', 'Wire Transfer', 'Credit Card'];
const AVAILABLE_TAGS = ['Direct Deposit', 'Card Charge', 'Enterprise Net30', 'Stripe', 'Razorpay', 'Verified'];

export default function PaymentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const preselectedInvoiceId = searchParams.get('invoiceId');

  const basePath = pathname?.startsWith('/payments') ? '/payments' : '/sales/payments';
  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create' || Boolean(preselectedInvoiceId);
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';

  const { data: payments = [], isLoading, refetch, isFetching } = useGetPaymentsListQuery();
  const { data: invoices = [], refetch: refetchInvoices } = useGetInvoiceFullListQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: accounts = [], refetch: refetchAccounts } = useGetAccountsListQuery(undefined, { refetchOnMountOrArgChange: true });

  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Form State strictly blank initial values (NO dummy static fallback)
  const initialFormState = {
    Customer_Name: '',
    Customer_Id: '',
    Invoice_Id: '',
    Invoice_No: '',
    Payment_Date: '',
    Invoice_Date: '',
    paid_amount: '',
    InvoiceAmount: '',
    TaxAmount: '0',
    NetAmount: '',
    Payment_Mode: 'Online',
    Payment_details: '',
    Transaction_No: '',
    Subscription_Id: '',
    status: 'success',
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Re-fetch master data immediately when entering Create or Edit mode
  useEffect(() => {
    if (viewMode === 'create' || viewMode === 'edit') {
      refetchInvoices();
      refetchAccounts();
    }
  }, [viewMode, refetchInvoices, refetchAccounts]);

  // Auto open form if arriving with invoiceId query param
  useEffect(() => {
    if (preselectedInvoiceId && invoices.length > 0) {
      const matched = invoices.find((i) => String(i.id) === preselectedInvoiceId);
      if (matched) {
        handleSelectInvoice(String(matched.id));
        setInternalViewMode('create');
      }
    }
  }, [preselectedInvoiceId, invoices]);

  const handleSelectInvoice = (invId: string) => {
    const inv = invoices.find((i) => String(i.id) === invId);
    if (inv) {
      setFormData((prev) => ({
        ...prev,
        Invoice_Id: String(inv.id),
        Invoice_No: inv.Invoice_Id,
        Customer_Name: inv.Customer_Name || '',
        Customer_Id: String(inv.Customer_Id || ''),
        Invoice_Date: inv.Invoice_Date || new Date().toISOString().split('T')[0],
        InvoiceAmount: String(inv.InvoiceAmount || 0),
        TaxAmount: String(inv.TaxAmount || 0),
        NetAmount: String(inv.NetAmount || inv.InvoiceAmount || 0),
        paid_amount: String(inv.NetAmount || inv.InvoiceAmount || 0),
        Subscription_Id: String(inv.Subscription_Id || ''),
      }));
    }
  };

  const handleOpenCreate = () => {
    setSelectedPayment(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push(`${basePath}/create`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push(basePath);
  };

  const handleOpenReceipt = (pay: PaymentRecord) => {
    setSelectedPayment(pay);
    setIsReceiptOpen(true);
  };

  const handleOpenDelete = (pay: PaymentRecord) => {
    setSelectedPayment(pay);
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
    if (!formData.Invoice_Id) errs.Invoice_Id = 'Invoice selection is required';
    if (!formData.Customer_Name) errs.Customer_Name = 'Customer is required';
    if (!formData.paid_amount || Number(formData.paid_amount) <= 0) {
      errs.paid_amount = 'Paid amount must be greater than zero';
    }
    if (!formData.Payment_Mode) errs.Payment_Mode = 'Payment mode is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve the highlighted validation errors');
      return;
    }

    const payload: Partial<PaymentRecord> = {
      Invoice_Id: formData.Invoice_Id,
      Invoice_No: formData.Invoice_No,
      Customer_Name: formData.Customer_Name,
      Customer_Id: formData.Customer_Id,
      Subscription_Id: formData.Subscription_Id,
      Payment_Date: formData.Payment_Date || new Date().toISOString().split('T')[0],
      Invoice_Date: formData.Invoice_Date,
      Payment_Mode: formData.Payment_Mode,
      paid_amount: Number(formData.paid_amount || 0),
      InvoiceAmount: Number(formData.InvoiceAmount || 0),
      TaxAmount: Number(formData.TaxAmount || 0),
      NetAmount: Number(formData.NetAmount || 0),
      Transaction_No: formData.Transaction_No || `TXN-${Date.now().toString().slice(-8)}`,
      Payment_details: formData.Payment_details || 'Settled via SuperAdmin',
      status: formData.status,
    };

    try {
      await createPayment(payload).unwrap();
      toast.success(`Payment of $${formData.paid_amount} recorded successfully`);
      handleBackToList();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to record payment');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPayment?.id) return;
    try {
      await deletePayment({ id: selectedPayment.id }).unwrap();
      toast.success('Payment entry deleted successfully');
      setIsDeleteOpen(false);
      setSelectedPayment(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete payment');
    }
  };

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        searchTerm === '' ||
        p.Payment_Id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Invoice_No?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Customer_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Transaction_No?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMode = modeFilter === 'all' || p.Payment_Mode?.toLowerCase() === modeFilter.toLowerCase();

      return matchSearch && matchMode;
    });
  }, [payments, searchTerm, modeFilter]);

  // Clean Pagination (NO rows per page dropdown)
  const totalItems = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage]);

  const handlePrintReceipt = () => {
    window.print();
  };

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE / EDIT VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create' || viewMode === 'edit') {
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
                <span className="text-foreground">Record Payment</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                Record Customer Settlement Payment
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToList}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-5"
            >
              <Save className="h-4 w-4" />
              {isCreating ? 'Saving...' : 'Record Payment'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: INVOICE & AMOUNT ALLOCATION */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  INVOICE & SETTLEMENT SPECIFICATIONS
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Invoice_Id" className="text-xs font-semibold uppercase tracking-wider">
                      SELECT INVOICE TO SETTLE <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="Invoice_Id"
                      value={formData.Invoice_Id}
                      onChange={(e) => handleSelectInvoice(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select Invoice</option>
                      {invoices.map((inv) => (
                        <option key={inv.id} value={String(inv.id)}>
                          {inv.Invoice_Id} - {inv.Customer_Name} (${inv.NetAmount})
                        </option>
                      ))}
                    </select>
                    {formErrors.Invoice_Id && <p className="text-[11px] text-rose-500">{formErrors.Invoice_Id}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="paid_amount" className="text-xs font-semibold uppercase tracking-wider">
                      AMOUNT RECEIVED ($) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="paid_amount"
                      type="number"
                      placeholder="e.g. 1500"
                      value={formData.paid_amount}
                      onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })}
                      className={formErrors.paid_amount ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.paid_amount && <p className="text-[11px] text-rose-500">{formErrors.paid_amount}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Payment_Mode" className="text-xs font-semibold uppercase tracking-wider">
                      PAYMENT MODE <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="Payment_Mode"
                      value={formData.Payment_Mode}
                      onChange={(e) => setFormData({ ...formData, Payment_Mode: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {PAYMENT_MODES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Payment_Date" className="text-xs font-semibold uppercase tracking-wider">
                      PAYMENT DATE
                    </Label>
                    <Input
                      id="Payment_Date"
                      type="date"
                      value={formData.Payment_Date}
                      onChange={(e) => setFormData({ ...formData, Payment_Date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Transaction_No" className="text-xs font-semibold uppercase tracking-wider">
                      TRANSACTION / REFERENCE NO.
                    </Label>
                    <Input
                      id="Transaction_No"
                      placeholder="e.g. UPI-1290382093 or CHK-4920"
                      value={formData.Transaction_No}
                      onChange={(e) => setFormData({ ...formData, Transaction_No: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: REMARKS & BANK REFERENCE */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  PAYMENT DETAILS & SETTLEMENT REMARKS
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  id="Payment_details"
                  rows={3}
                  placeholder="Provide transaction details, issuing bank name, clearance receipt notes..."
                  value={formData.Payment_details}
                  onChange={(e) => setFormData({ ...formData, Payment_details: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: PAYMENT SUMMARY */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  SETTLEMENT SUMMARY
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
                  <span className="text-muted-foreground">Invoice No:</span>
                  <span className="font-semibold text-foreground">{formData.Invoice_No || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Mode:</span>
                  <span className="font-semibold text-foreground">{formData.Payment_Mode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-semibold text-emerald-600 text-sm">
                    ${formData.paid_amount || '0'}
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
                  INTERNAL AUDIT NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Internal audit notes or accounting reconciliation remarks..."
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
            Payments & Collections
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track customer settlements, record incoming revenue, log transaction reference IDs, and generate payment receipts.
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
            Record Payment
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
                placeholder="Search by payment ID, invoice #, customer, or transaction ID..."
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
                value={modeFilter}
                onChange={(e) => {
                  setModeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium"
              >
                <option value="all">All Modes</option>
                {PAYMENT_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {(searchTerm || modeFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setModeFilter('all');
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

      {/* Payments Table */}
      <Card className="shadow-xs border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-50/70 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Payment Record</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Linked Invoice</th>
                <th className="py-3 px-4">Mode & Date</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading payment records...
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <CreditCard className="h-10 w-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    No payments found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((pay) => (
                  <tr
                    key={pay.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-blue-600" />
                        {pay.Payment_Id || `PAY-${pay.id}`}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {pay.Transaction_No || 'N/A'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {pay.Customer_Name}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-slate-700 dark:text-slate-300">
                      {pay.Invoice_No || `INV-${pay.Invoice_Id}`}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <Badge variant="outline" className="font-normal text-[11px]">
                        {pay.Payment_Mode}
                      </Badge>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{pay.Payment_Date}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      ${pay.paid_amount}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-xs">
                        {(pay.status || 'success').toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenReceipt(pay)}
                          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-blue-600"
                          title="View Receipt"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(pay)}
                          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-rose-600"
                          title="Delete Payment"
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
      </Card>

      {/* RECEIPT MODAL */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                Receipt: {selectedPayment?.Payment_Id || 'PAY-001'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintReceipt}
                className="gap-1.5 text-xs cursor-pointer mr-6"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>
            </DialogTitle>
            <DialogDescription>
              Official payment settlement receipt.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4 py-2 border rounded-xl p-5 bg-white dark:bg-slate-900 shadow-xs text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  PAYMENT SETTLED
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200">
                  SUCCESS
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedPayment.Customer_Name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Reference:</span>
                  <span className="font-mono font-medium">{selectedPayment.Invoice_No || `INV-${selectedPayment.Invoice_Id}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date:</span>
                  <span>{selectedPayment.Payment_Date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Mode:</span>
                  <span className="font-medium">{selectedPayment.Payment_Mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono">{selectedPayment.Transaction_No || 'N/A'}</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between items-center text-sm">
                <span className="font-bold">Total Settled:</span>
                <span className="font-bold text-emerald-600 text-base">
                  ${selectedPayment.paid_amount}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiptOpen(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment Entry"
        description="Are you sure you want to remove this payment entry? This will revert the settled amount on the associated invoice."
        isLoading={isDeleting}
      />
    </div>
  );
}
