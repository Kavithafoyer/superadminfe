'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  Eye,
  Edit2,
  Plus,
  Download,
  GraduationCap,
  Laptop,
  ShoppingCart,
  Building2,
  Clock,
  FileText,
  BarChart2,
  Zap,
  LayoutGrid,
  User,
  History,
  ChevronDown,
  X,
  Sparkles,
  ShieldCheck,
  CreditCard,
  MapPin,
  Save,
  Loader2,
  RefreshCw,
  Trash2,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  ExternalLink,
  FileSpreadsheet,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { INITIAL_CUSTOMERS, CustomerRecord } from './customerData';
import {
  useGetAccountsListQuery,
  useGetAccountFullListQuery,
  useGetCustomerKpiAnalyticsQuery,
  useGetCustomerAuditHistoryQuery,
  useGetCustomerDocumentListQuery,
  useUploadCustomerDocumentMutation,
  useDeleteCustomerDocumentMutation,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetRenewalDueListQuery,
  useGetInvoiceFullListQuery,
  AccountRecord,
  CustomerAuditHistoryRecord,
  DocumentMasterRecord,
  RenewalDueRecord,
  InvoiceRecord,
  downloadAccountsExportCsv,
} from '@/service/api/superAdminService';

interface CustomerMasterScreenProps {
  initialMode?: 'edit_customer' | 'add_customer';
  initialCustomerId?: string;
  initialTab?: 'profile' | 'contact' | 'subscriptions' | 'sla';
  initialSubTab?: string;
}

const formatToIsoDate = (dateStr?: string): string => {
  if (!dateStr) {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  }
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() + 1);
  return fallback.toISOString().split('T')[0];
};

const mapAccountToCustomer = (acc: any): CustomerRecord => {
  const industryStr = String(acc.Industry || 'IT Services').toLowerCase();
  let industryIcon: CustomerRecord['industryIcon'] = 'it';
  if (industryStr.includes('edu')) industryIcon = 'education';
  else if (industryStr.includes('retail')) industryIcon = 'retail';
  else if (industryStr.includes('real')) industryIcon = 'real-estate';
  else if (industryStr.includes('people') || industryStr.includes('hrm')) industryIcon = 'people';

  const rawArr = acc.Annual_Contract_ARR || acc.arr || '12,00,000';
  const numericArr = Number(String(rawArr).replace(/[^0-9]/g, '')) || 1200000;

  return {
    id: String(acc.id || acc.Account_Id || ''),
    name: acc.Organization_Name || acc.name || 'Unnamed Customer',
    customerId: acc.Account_Id || (acc.id ? `ACC-${acc.id}` : 'CUST-0001'),
    industry: acc.Industry || 'Information Technology',
    industryIcon,
    product: acc.Primary_Product || acc.product || 'Pegatto CRM',
    plan: acc.Subscribed_Plan || acc.plan || 'Professional',
    startDate: acc.Created_Date || '01 Jan 2026',
    nextRenewal: acc.Next_Renewal || '31 Dec 2026',
    status: (acc.Account_Status || (acc.Active_Flag !== false ? 'Active' : 'Expiring')) as any,
    arr: typeof rawArr === 'number' ? rawArr.toLocaleString('en-IN') : String(rawArr),
    arrValue: numericArr,
    location: acc.Location || acc.City || 'India',
    contactPerson: acc.Contact_Name || acc.contactPerson || 'Contact Person',
    phone: acc.Phone_Number || acc.phone || '',
    email: acc.Mail || acc.email || '',
    customerSince: acc.Created_Date ? String(acc.Created_Date).slice(0, 7) : '2026',
    users: Number(acc.Licensed_User_Seats || acc.users || 25),
    activeUsers: Number(acc.activeUsers || acc.Licensed_User_Seats || 20),
    students: Number(acc.students || 0),
    studentLogins: Number(acc.studentLogins || 0),
    keyModules: Number(acc.keyModules || 6),
    totalModules: Number(acc.totalModules || 10),
    tenantsCount: Number(acc.tenantsCount || 1),
    healthScore: Number(acc.healthScore || 90),
    healthStatus: acc.healthStatus || 'Healthy',
    subscribedProducts: acc.subscribedProducts || [
      {
        name: acc.Primary_Product || 'Pegatto CRM',
        edition: acc.Subscribed_Plan || 'Professional',
        status: 'Active',
        icon: 'laptop',
      },
    ],
    addonsList: acc.addonsList || ['AI Lead Scoring'],
    accountOwner: acc.Account_Owner || 'Ananya Sharma (VP Accounts)',
    slaTier: acc.SLA_Tier || '24/7 Mission-Critical Gold',
    notes: acc.Description || '',
  };
};

export function CustomerMasterScreen({
  initialMode = 'edit_customer',
  initialCustomerId,
  initialTab = 'profile',
  initialSubTab,
}: CustomerMasterScreenProps) {
  const router = useRouter();

  // Active subtab navigation state (defaults to prop or 'Customer List')
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab || 'Customer List');

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Server-side filter & search state
  const [selectedProductFilter, setSelectedProductFilter] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query to prevent excessive backend API calls while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Global full accounts list for overall KPI metrics (Customer Overview Donut & Product Adoption bars)
  const { data: fullAccountsData = [] } = useGetAccountFullListQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Dedicated backend API for Customer Master KPI Metrics and Charts
  const {
    data: customerKpiData,
    isLoading: isKpiLoading,
    isFetching: isKpiFetching,
  } = useGetCustomerKpiAnalyticsQuery(
    selectedProductFilter !== 'All Products' ? { product: selectedProductFilter } : undefined,
    { refetchOnMountOrArgChange: true }
  );

  // Server-side filtered query for the customer table list
  const {
    data: accountsData = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAccountsListQuery(
    {
      product: selectedProductFilter !== 'All Products' ? selectedProductFilter : undefined,
      search: debouncedSearch.trim() || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [createAccountMutation, { isLoading: isCreating }] = useCreateAccountMutation();
  const [updateAccountMutation, { isLoading: isUpdating }] = useUpdateAccountMutation();
  const [deleteAccountMutation, { isLoading: isDeleting }] = useDeleteAccountMutation();

  // Map full accounts to CustomerRecord for global KPIs
  const fullCustomers = useMemo<CustomerRecord[]>(() => {
    if (Array.isArray(fullAccountsData) && fullAccountsData.length > 0) {
      return fullAccountsData.map(mapAccountToCustomer);
    }
    if (Array.isArray(accountsData) && accountsData.length > 0) {
      return accountsData.map(mapAccountToCustomer);
    }
    return [];
  }, [fullAccountsData, accountsData]);

  // Map backend accounts to CustomerRecord from live API
  const customers = useMemo<CustomerRecord[]>(() => {
    if (Array.isArray(accountsData) && accountsData.length > 0) {
      return accountsData.map(mapAccountToCustomer);
    }
    return [];
  }, [accountsData]);

  // Compute live KPI metrics dynamically from backend API (with fallback from customer list)
  const kpiMetrics = useMemo(() => {
    if (customerKpiData) {
      return {
        total: customerKpiData.total_customers,
        active: customerKpiData.active_customers,
        expiring: customerKpiData.expiring_customers,
        overdue: customerKpiData.overdue_customers,
        formattedArr: customerKpiData.formatted_arr,
        activePct: customerKpiData.active_pct,
        expiringPct: customerKpiData.expiring_pct,
        overduePct: customerKpiData.overdue_pct,
      };
    }

    const total = fullCustomers.length;
    const active = fullCustomers.filter((c) => c.status === 'Active').length;
    const expiring = fullCustomers.filter((c) => c.status === 'Expiring').length;
    const overdue = fullCustomers.filter((c) => c.status === 'Overdue').length;
    const totalArrVal = fullCustomers.reduce((sum, c) => sum + (c.arrValue || 0), 0);
    const formattedArr =
      totalArrVal >= 10000000
        ? `₹${(totalArrVal / 10000000).toFixed(2)} Cr`
        : totalArrVal >= 100000
        ? `₹${(totalArrVal / 100000).toFixed(1)} L`
        : `₹${totalArrVal.toLocaleString('en-IN')}`;

    const activePct = total > 0 ? Number(((active / total) * 100).toFixed(1)) : 0;
    const expiringPct = total > 0 ? Number(((expiring / total) * 100).toFixed(1)) : 0;
    const overduePct = total > 0 ? Number(((overdue / total) * 100).toFixed(1)) : 0;

    return {
      total,
      active,
      expiring,
      overdue,
      formattedArr,
      activePct,
      expiringPct,
      overduePct,
    };
  }, [customerKpiData, fullCustomers]);

  // Dynamic products list extracted from live accounts + standard choices
  const availableProducts = useMemo(() => {
    const baseProducts = [
      { id: 'All Products', label: 'All Products' },
      { id: 'Education', label: 'Education' },
      { id: 'IT Services', label: 'IT Services' },
      { id: 'Retail', label: 'Retail' },
      { id: 'Real Estate', label: 'Real Estate' },
      { id: 'People (HRMS)', label: 'People (HRMS)' },
    ];
    const customProducts: Array<{ id: string; label: string }> = [];
    fullCustomers.forEach((c) => {
      const prod = c.product?.trim();
      if (
        prod &&
        !baseProducts.some(
          (b) => b.id.toLowerCase() === prod.toLowerCase() || b.label.toLowerCase() === prod.toLowerCase()
        ) &&
        !customProducts.some((cp) => cp.id.toLowerCase() === prod.toLowerCase())
      ) {
        customProducts.push({ id: prod, label: prod });
      }
    });
    return [...baseProducts, ...customProducts];
  }, [fullCustomers]);

  // Compute live product adoption dynamically from backend KPI API (with fallback from active customers)
  const productAdoption = useMemo(() => {
    const iconMap: Record<string, any> = {
      Education: GraduationCap,
      'IT Services': Laptop,
      Retail: ShoppingCart,
      'Real Estate': Building2,
      'People (HRMS)': Users,
    };

    if (customerKpiData && Array.isArray(customerKpiData.product_adoption) && customerKpiData.product_adoption.length > 0) {
      return customerKpiData.product_adoption.map((p) => {
        let Icon = iconMap[p.label];
        if (!Icon) {
          const lower = p.label.toLowerCase();
          if (lower.includes('edu')) Icon = GraduationCap;
          else if (lower.includes('retail')) Icon = ShoppingCart;
          else if (lower.includes('real')) Icon = Building2;
          else if (lower.includes('people') || lower.includes('hrm')) Icon = Users;
          else Icon = Laptop;
        }
        return {
          label: p.label,
          icon: Icon,
          count: p.count,
          pct: p.pct,
        };
      });
    }

    const activeCustomers = fullCustomers.filter((c) => c.status === 'Active');
    const counts: Record<string, number> = {
      Education: 0,
      'IT Services': 0,
      Retail: 0,
      'Real Estate': 0,
      'People (HRMS)': 0,
    };

    activeCustomers.forEach((c) => {
      const prod = (c.product || '').toLowerCase();
      if (prod.includes('edu')) counts.Education++;
      else if (prod.includes('it') || prod.includes('crm') || prod.includes('cloud') || prod.includes('software')) counts['IT Services']++;
      else if (prod.includes('retail') || prod.includes('shop') || prod.includes('store')) counts.Retail++;
      else if (prod.includes('real') || prod.includes('estate') || prod.includes('prop')) counts['Real Estate']++;
      else if (prod.includes('people') || prod.includes('hrm') || prod.includes('hr')) counts['People (HRMS)']++;
      else {
        const prodName = c.product?.trim() || 'Other';
        counts[prodName] = (counts[prodName] || 0) + 1;
      }
    });

    const maxCount = Math.max(...Object.values(counts), 1);

    return Object.entries(counts).map(([label, count]) => {
      const Icon = iconMap[label] || Layers;
      return {
        label,
        icon: Icon,
        count,
        pct: count > 0 ? Math.round((count / maxCount) * 100) : 0,
      };
    });
  }, [customerKpiData, fullCustomers]);

  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Audit History state & query (triggered by "Activity & History" subtab)
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [debouncedAuditSearch, setDebouncedAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState<'ALL' | 'CREATE' | 'UPDATE' | 'DELETE'>('ALL');
  const [selectedAuditCustomerId, setSelectedAuditCustomerId] = useState<string>('ALL');
  const [selectedAuditDetail, setSelectedAuditDetail] = useState<CustomerAuditHistoryRecord | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAuditSearch(auditSearchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [auditSearchQuery]);

  const {
    data: auditHistoryData = [],
    isLoading: isAuditLoading,
    isFetching: isAuditFetching,
    refetch: refetchAudit,
  } = useGetCustomerAuditHistoryQuery(
    activeSubTab === 'Activity & History'
      ? {
          recordId: selectedAuditCustomerId !== 'ALL' ? selectedAuditCustomerId : undefined,
          action: auditActionFilter !== 'ALL' ? auditActionFilter : undefined,
          search: debouncedAuditSearch.trim() || undefined,
        }
      : undefined,
    { skip: activeSubTab !== 'Activity & History', refetchOnMountOrArgChange: true }
  );

  // Customer Documents state & query (triggered by "Documents" subtab)
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [debouncedDocSearch, setDebouncedDocSearch] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('ALL');
  const [selectedDocCustomerId, setSelectedDocCustomerId] = useState<string>('ALL');
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [selectedDocDetail, setSelectedDocDetail] = useState<DocumentMasterRecord | null>(null);

  const [uploadFormData, setUploadFormData] = useState<{
    accountId: string;
    fileName: string;
    fileType: string;
    description: string;
    file: File | null;
  }>({
    accountId: '',
    fileName: '',
    fileType: 'Contract',
    description: '',
    file: null,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDocSearch(docSearchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [docSearchQuery]);

  const {
    data: customerDocumentsData = [],
    isLoading: isDocLoading,
    isFetching: isDocFetching,
    refetch: refetchDocuments,
  } = useGetCustomerDocumentListQuery(
    activeSubTab === 'Documents'
      ? {
          accountId: selectedDocCustomerId !== 'ALL' ? selectedDocCustomerId : undefined,
          fileType: docTypeFilter !== 'ALL' ? docTypeFilter : undefined,
          search: debouncedDocSearch.trim() || undefined,
        }
      : undefined,
    { skip: activeSubTab !== 'Documents', refetchOnMountOrArgChange: true }
  );

  const [uploadCustomerDoc, { isLoading: isUploadingDoc }] = useUploadCustomerDocumentMutation();
  const [deleteCustomerDoc, { isLoading: isDeletingDoc }] = useDeleteCustomerDocumentMutation();

  const handleUploadDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.accountId) {
      toast.error('Please select a customer account');
      return;
    }
    if (!uploadFormData.fileName.trim()) {
      toast.error('Please enter a document title or filename');
      return;
    }

    try {
      let fileBase64 = '';
      if (uploadFormData.file) {
        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const res = String(reader.result || '');
            const base64 = res.includes(',') ? res.split(',')[1] : res;
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(uploadFormData.file!);
        });
      }

      await uploadCustomerDoc({
        Account_Id: uploadFormData.accountId,
        FileName: uploadFormData.fileName.trim(),
        File_Type: uploadFormData.fileType,
        Description: uploadFormData.description.trim(),
        File: fileBase64,
      }).unwrap();

      toast.success('Document uploaded successfully');
      setIsUploadDocModalOpen(false);
      setUploadFormData({
        accountId: '',
        fileName: '',
        fileType: 'Contract',
        description: '',
        file: null,
      });
      refetchDocuments();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload document');
    }
  };

  const handleDeleteDocument = async (id: string | number, name?: string) => {
    if (!confirm(`Are you sure you want to delete "${name || 'this document'}"?`)) return;
    try {
      await deleteCustomerDoc({ id }).unwrap();
      toast.success('Document deleted successfully');
      refetchDocuments();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete document');
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // RENEWALS & BILLING STATE & QUERIES (Triggered by "Renewals & Billing")
  // ══════════════════════════════════════════════════════════════════════
  const [renewalSearchQuery, setRenewalSearchQuery] = useState('');
  const [debouncedRenewalSearch, setDebouncedRenewalSearch] = useState('');
  const [renewalStatusFilter, setRenewalStatusFilter] = useState<'ALL' | 'Active' | 'Expiring' | 'Overdue'>('ALL');
  const [selectedRenewalCustomerId, setSelectedRenewalCustomerId] = useState<string>('ALL');
  const [activeRenewalSubView, setActiveRenewalSubView] = useState<'schedule' | 'invoices'>('schedule');
  const [selectedRenewalDetail, setSelectedRenewalDetail] = useState<any | null>(null);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<InvoiceRecord | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRenewalSearch(renewalSearchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [renewalSearchQuery]);

  // Live Renewal API: calls superadmin/renewallist/ with filtering
  const {
    data: renewalsData = [],
    isLoading: isRenewalLoading,
    isFetching: isRenewalFetching,
    refetch: refetchRenewals,
  } = useGetRenewalDueListQuery(
    activeSubTab === 'Renewals & Billing'
      ? {
          customerId: selectedRenewalCustomerId !== 'ALL' ? selectedRenewalCustomerId : undefined,
          status: renewalStatusFilter !== 'ALL' ? renewalStatusFilter : undefined,
          search: debouncedRenewalSearch.trim() || undefined,
        }
      : undefined,
    { skip: activeSubTab !== 'Renewals & Billing', refetchOnMountOrArgChange: true }
  );

  // Live Billing & Invoices API: calls superadmin/InvoiceFullList/
  const {
    data: invoicesData = [],
    isLoading: isInvoiceLoading,
    isFetching: isInvoiceFetching,
    refetch: refetchInvoices,
  } = useGetInvoiceFullListQuery(
    activeSubTab === 'Renewals & Billing'
      ? {
          customerId: selectedRenewalCustomerId !== 'ALL' ? selectedRenewalCustomerId : undefined,
          search: debouncedRenewalSearch.trim() || undefined,
        }
      : undefined,
    { skip: activeSubTab !== 'Renewals & Billing', refetchOnMountOrArgChange: true }
  );

  // Helper to calculate days remaining until renewal date with status badge classification
  const getRenewalMeta = (dateStr?: string) => {
    if (!dateStr) return { days: 999, label: 'Not Scheduled', statusType: 'active' as const };
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) {
      return { days: 999, label: dateStr, statusType: 'active' as const };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        days: diffDays,
        label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`,
        statusType: 'overdue' as const,
      };
    }
    if (diffDays === 0) {
      return {
        days: 0,
        label: 'Due Today',
        statusType: 'expiring' as const,
      };
    }
    if (diffDays <= 30) {
      return {
        days: diffDays,
        label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
        statusType: 'expiring' as const,
      };
    }
    const months = Math.floor(diffDays / 30);
    return {
      days: diffDays,
      label: diffDays > 60 ? `In ${diffDays} days (~${months} mo)` : `In ${diffDays} days`,
      statusType: 'active' as const,
    };
  };

  // Build unified renewal list combining live backend Renewal records and Customer Master accounts
  const allUnifiedRenewals = useMemo(() => {
    const list: Array<{
      id: string | number;
      renewalId: string;
      customerId: string;
      customerName: string;
      product: string;
      plan: string;
      startDate: string;
      renewalDate: string;
      renewalAmount: string;
      renewalAmountValue: number;
      status: 'Active' | 'Expiring' | 'Overdue';
      paymentStatus: string;
      daysRemaining: number;
      daysLabel: string;
      rawRenewal?: RenewalDueRecord;
    }> = [];

    // 1. Add dedicated renewal records from live backend API
    if (Array.isArray(renewalsData)) {
      renewalsData.forEach((r, idx) => {
        const meta = getRenewalMeta(r.RenewalDate);
        let derivedStatus: 'Active' | 'Expiring' | 'Overdue' = 'Active';
        if (meta.statusType === 'overdue' || String(r.Renewal_Status || '').toLowerCase().includes('overdue')) {
          derivedStatus = 'Overdue';
        } else if (meta.statusType === 'expiring' || String(r.Renewal_Status || '').toLowerCase().includes('expir')) {
          derivedStatus = 'Expiring';
        }

        const amt = Number(r.RenewalAmount || r.PlanNetAmount || 0);
        const resolvedCustId =
          typeof r.Customer_Id === 'object' && r.Customer_Id !== null
            ? (r.Customer_Id.Account_Id || String(r.Customer_Id.id || ''))
            : String(r.Customer_Id || '');
        const resolvedCustName =
          r.Customer_Name ||
          (typeof r.Customer_Id === 'object' && r.Customer_Id ? r.Customer_Id.Organization_Name : '') ||
          '—';
        const resolvedPlan =
          r.Plan_Name ||
          (typeof r.Customer_Id === 'object' && r.Customer_Id ? r.Customer_Id.Subscribed_Plan : '') ||
          '—';
        const resolvedRenewalDate =
          r.RenewalDate ||
          (typeof r.Customer_Id === 'object' && r.Customer_Id ? r.Customer_Id.Next_Renewal : '') ||
          '—';

        list.push({
          id: r.id || `ren-${idx}`,
          renewalId: r.Renewal_Id || `REN-${r.id || idx + 1}`,
          customerId: resolvedCustId,
          customerName: resolvedCustName,
          product: r.Producttype || '—',
          plan: resolvedPlan,
          startDate: r.Created_Date ? String(r.Created_Date).slice(0, 10) : '—',
          renewalDate: resolvedRenewalDate,
          renewalAmount: amt > 0 ? `₹${amt.toLocaleString('en-IN')}` : '—',
          renewalAmountValue: amt,
          status: derivedStatus,
          paymentStatus: r.Payment_Status || (derivedStatus === 'Active' ? 'Paid' : 'Pending'),
          daysRemaining: meta.days,
          daysLabel: meta.label,
          rawRenewal: r,
        });
      });
    }

    // 2. Add customer master records whose renewal schedule isn't already listed
    fullCustomers.forEach((cust, idx) => {
      const alreadyIncluded = list.some(
        (item) =>
          (cust.name && item.customerName.toLowerCase() === cust.name.toLowerCase()) ||
          (cust.customerId && item.customerId === cust.customerId)
      );
      if (!alreadyIncluded) {
        const meta = getRenewalMeta(cust.nextRenewal);
        let derivedStatus: 'Active' | 'Expiring' | 'Overdue' = 'Active';
        if (meta.statusType === 'overdue' || cust.status === 'Overdue') {
          derivedStatus = 'Overdue';
        } else if (meta.statusType === 'expiring' || cust.status === 'Expiring') {
          derivedStatus = 'Expiring';
        }

        list.push({
          id: `cust-ren-${cust.id || idx}`,
          renewalId: cust.customerId || (cust.id ? `ACC-${cust.id}` : `REN-${idx + 1}`),
          customerId: cust.customerId || cust.id,
          customerName: cust.name,
          product: cust.product || '—',
          plan: cust.plan || '—',
          startDate: cust.startDate || '—',
          renewalDate: cust.nextRenewal || '—',
          renewalAmount: cust.arr ? `₹${cust.arr.replace(/[^0-9,]/g, '')}` : '—',
          renewalAmountValue: cust.arrValue || 0,
          status: derivedStatus,
          paymentStatus: derivedStatus === 'Active' ? 'Paid' : 'Pending',
          daysRemaining: meta.days,
          daysLabel: meta.label,
        });
      }
    });

    // Filter by customer and search query (without status, so badge counts stay globally accurate)
    return list.filter((item) => {
      if (selectedRenewalCustomerId !== 'ALL') {
        const matchCust =
          item.customerId === selectedRenewalCustomerId ||
          item.customerName.toLowerCase() === selectedRenewalCustomerId.toLowerCase();
        if (!matchCust) return false;
      }
      if (debouncedRenewalSearch.trim()) {
        const q = debouncedRenewalSearch.toLowerCase();
        const matches =
          item.customerName.toLowerCase().includes(q) ||
          item.renewalId.toLowerCase().includes(q) ||
          item.customerId.toLowerCase().includes(q) ||
          item.product.toLowerCase().includes(q) ||
          item.plan.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [renewalsData, fullCustomers, selectedRenewalCustomerId, debouncedRenewalSearch]);

  // Compute live Renewal KPI metrics (from allUnifiedRenewals so badge counts are always accurate across statuses)
  const renewalKpiMetrics = useMemo(() => {
    const totalCount = allUnifiedRenewals.length;
    const expiringSoon = allUnifiedRenewals.filter((r) => r.status === 'Expiring' || (r.daysRemaining >= 0 && r.daysRemaining <= 30)).length;
    const overdueCount = allUnifiedRenewals.filter((r) => r.status === 'Overdue' || r.daysRemaining < 0).length;
    const activeCount = allUnifiedRenewals.filter((r) => r.status === 'Active' && r.daysRemaining > 30).length;
    const totalPipelineValue = allUnifiedRenewals.reduce((sum, r) => sum + (r.renewalAmountValue || 0), 0);
    const formattedPipeline =
      totalPipelineValue >= 10000000
        ? `₹${(totalPipelineValue / 10000000).toFixed(2)} Cr`
        : totalPipelineValue >= 100000
        ? `₹${(totalPipelineValue / 100000).toFixed(1)} L`
        : `₹${totalPipelineValue.toLocaleString('en-IN')}`;

    const totalInvoiced = invoicesData.reduce((sum, inv) => sum + (Number(inv.NetAmount || inv.InvoiceAmount || 0)), 0);
    const formattedInvoiced =
      totalInvoiced >= 10000000
        ? `₹${(totalInvoiced / 10000000).toFixed(2)} Cr`
        : totalInvoiced >= 100000
        ? `₹${(totalInvoiced / 100000).toFixed(1)} L`
        : `₹${totalInvoiced.toLocaleString('en-IN')}`;

    return {
      totalCount,
      expiringSoon,
      overdueCount,
      activeCount,
      formattedPipeline,
      formattedInvoiced,
      invoiceCount: invoicesData.length,
    };
  }, [allUnifiedRenewals, invoicesData]);

  // Filtered live renewal list for the table view (filters by renewalStatusFilter)
  const unifiedRenewals = useMemo(() => {
    if (renewalStatusFilter === 'ALL') return allUnifiedRenewals;
    return allUnifiedRenewals.filter((item) => item.status === renewalStatusFilter);
  }, [allUnifiedRenewals, renewalStatusFilter]);

  // Filtered live billing invoices from backend (strictly real data, never fake/mock)
  const filteredInvoices = useMemo(() => {
    if (!Array.isArray(invoicesData)) return [];
    return invoicesData.filter((inv) => {
      if (selectedRenewalCustomerId !== 'ALL') {
        const custId = String(inv.Customer_Id?.Account_Id || inv.Customer_Id?.id || inv.Customer_Id || '');
        const custName = String(inv.Customer_Name || inv.Customer_Id?.Organization_Name || '').toLowerCase();
        const selected = selectedRenewalCustomerId.toLowerCase();
        if (custId !== selectedRenewalCustomerId && !custName.includes(selected)) {
          return false;
        }
      }
      if (debouncedRenewalSearch.trim()) {
        const q = debouncedRenewalSearch.toLowerCase();
        const matches =
          String(inv.Customer_Name || inv.Customer_Id?.Organization_Name || '').toLowerCase().includes(q) ||
          String(inv.Invoice_Id || '').toLowerCase().includes(q) ||
          String(inv.Subscription_Name || inv.Subscription_Id?.Plan_Name || inv.InvoiceFor || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [invoicesData, selectedRenewalCustomerId, debouncedRenewalSearch]);

  // Split Screen Drawer State (matching ProductMasterScreen layout)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerMode, setDrawerMode] = useState<'edit_customer' | 'add_customer'>(initialMode);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'profile' | 'contact' | 'subscriptions' | 'sla'>(initialTab);

  // Selected Customer ID
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(() => {
    return initialCustomerId || '';
  });

  const selectedCustomer = useMemo<CustomerRecord | null>(() => {
    if (customers.length === 0) return null;
    return customers.find((c) => c.id === selectedCustomerId) || customers[0] || null;
  }, [customers, selectedCustomerId]);

  useEffect(() => {
    if (!selectedCustomerId && customers.length > 0) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  // Form State for Drawer
  const [formState, setFormState] = useState<Partial<CustomerRecord>>({
    name: '',
    customerId: '',
    industry: 'Information Technology',
    industryIcon: 'it',
    product: 'Pegatto CRM',
    plan: 'Professional',
    startDate: '',
    nextRenewal: '',
    status: 'Active',
    arr: '12,00,000',
    arrValue: 1200000,
    location: '',
    contactPerson: '',
    phone: '',
    email: '',
    customerSince: '',
    users: 25,
    activeUsers: 20,
    students: 0,
    studentLogins: 0,
    keyModules: 6,
    totalModules: 10,
    tenantsCount: 1,
    healthScore: 90,
    healthStatus: 'Healthy',
    subscribedProducts: [
      { name: 'Pegatto CRM', edition: 'Professional', status: 'Active', icon: 'laptop' },
    ],
    addonsList: ['AI Lead Scoring'],
  });

  // Sync form when selected customer or mode changes
  useEffect(() => {
    if (drawerMode === 'edit_customer' && selectedCustomer) {
      setFormState({ ...selectedCustomer });
    } else if (drawerMode === 'edit_customer' && !selectedCustomer && customers.length === 0) {
      handleStartAddCustomer();
    }
  }, [selectedCustomer, drawerMode, customers.length]);

  // If initialCustomerId changes from props
  useEffect(() => {
    if (initialCustomerId) {
      setSelectedCustomerId(initialCustomerId);
      setDrawerMode('edit_customer');
      setIsDrawerOpen(true);
    }
  }, [initialCustomerId]);

  // If initialMode changes from props
  useEffect(() => {
    if (initialMode === 'add_customer') {
      handleStartAddCustomer();
    }
  }, [initialMode]);

  // Handle select row from table
  const handleSelectCustomer = (cust: CustomerRecord) => {
    setSelectedCustomerId(cust.id);
    setDrawerMode('edit_customer');
    setFormState({ ...cust });
    setIsDrawerOpen(true);
  };

  // Open "Add Customer" mode in right drawer
  const handleStartAddCustomer = () => {
    setDrawerMode('add_customer');
    setActiveDrawerTab('profile');
    setFormState({
      id: `cust-${Date.now().toString(36)}`,
      name: '',
      customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      industry: 'Information Technology',
      industryIcon: 'it',
      product: 'Pegatto CRM',
      plan: 'Professional',
      startDate: '01 Dec 2026',
      nextRenewal: '30 Nov 2027',
      status: 'Active',
      arr: '24,00,000',
      arrValue: 2400000,
      location: 'Bangalore, India',
      contactPerson: '',
      phone: '',
      email: '',
      customerSince: 'Dec 2026',
      users: 50,
      activeUsers: 45,
      students: 0,
      studentLogins: 0,
      keyModules: 6,
      totalModules: 10,
      tenantsCount: 1,
      healthScore: 90,
      healthStatus: 'Healthy',
      subscribedProducts: [
        { name: 'Pegatto CRM', edition: 'Professional', status: 'Active', icon: 'laptop' },
      ],
      addonsList: ['AI Lead Scoring'],
    });
    setIsDrawerOpen(true);
  };

  // Handle Save (Create or Update) via Backend Mutations
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name?.trim()) {
      toast.error('Please enter customer company name');
      return;
    }

    const currentUserId = Number(
      (typeof window !== 'undefined' &&
        (localStorage.getItem('UserId') || localStorage.getItem('userId'))) ||
        1
    );

    const payload: Partial<AccountRecord> = {
      Organization_Name: formState.name,
      Contact_Name: formState.contactPerson || formState.name,
      Mail: formState.email || `${formState.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
      Phone_Number: formState.phone || '+91 98000 00000',
      Industry: formState.industry || 'Information Technology',
      Location: formState.location || 'India',
      Primary_Product: formState.product || 'Pegatto CRM',
      Subscribed_Plan: formState.plan || 'Standard',
      Annual_Contract_ARR: formState.arr || '12,00,000',
      Next_Renewal: formatToIsoDate(formState.nextRenewal),
      Licensed_User_Seats: String(formState.users || 10),
      Account_Status: formState.status || 'Active',
      Active_Flag: formState.status === 'Active',
      Account_Owner: formState.accountOwner || 'Ananya Sharma (VP Accounts)',
      SLA_Tier: formState.slaTier || '24/7 Mission-Critical Gold',
      Description: formState.notes || '',
      Created_By: currentUserId,
      Updated_By: currentUserId,
      Is_Deleted: false,
    };

    try {
      if (drawerMode === 'add_customer') {
        const res = await createAccountMutation(payload).unwrap();
        const createdId = String(res?.id || res?.Account_Id || `cust-${Date.now()}`);
        setSelectedCustomerId(createdId);
        setDrawerMode('edit_customer');
        toast.success(`Customer "${formState.name}" created successfully in backend!`);
      } else {
        await updateAccountMutation({
          id: selectedCustomerId,
          ...payload,
        }).unwrap();
        toast.success(`Customer "${formState.name}" updated successfully in backend!`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.Error || err?.message || 'Failed to save customer');
    }
  };

  // Handle Delete Customer via Backend Mutation
  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}"?`)) return;
    try {
      await deleteAccountMutation({ id, Account_Id: id }).unwrap();
      toast.success(`Customer "${name}" deleted successfully!`);
      if (selectedCustomerId === id) {
        setIsDrawerOpen(false);
      }
      setSelectedCustomerIds((prev) => prev.filter((item) => item !== id));
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.Error || err?.message || 'Failed to delete customer');
    }
  };

  // Handle Bulk Delete Selected Customers via Backend Mutation
  const handleBulkDelete = async () => {
    if (selectedCustomerIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedCustomerIds.length} selected customer(s)?`)) return;
    try {
      for (const id of selectedCustomerIds) {
        await deleteAccountMutation({ id, Account_Id: id }).unwrap();
      }
      toast.success(`Successfully deleted ${selectedCustomerIds.length} customer(s)!`);
      if (selectedCustomerIds.includes(selectedCustomerId)) {
        setIsDrawerOpen(false);
      }
      setSelectedCustomerIds([]);
    } catch (err: any) {
      toast.error('Failed to delete some selected customers');
    }
  };

  // Export customer records as CSV directly from backend API (with client fallback)
  const handleExportCustomers = async (targetList?: CustomerRecord[]) => {
    const listToExport =
      targetList ||
      (selectedCustomerIds.length > 0
        ? filteredCustomers.filter((c) => selectedCustomerIds.includes(c.id))
        : filteredCustomers.length > 0
        ? filteredCustomers
        : customers);

    if (!listToExport || listToExport.length === 0) {
      toast.error('No customer records available to export');
      return;
    }

    try {
      const exportIds = targetList
        ? targetList.map((c) => c.id)
        : selectedCustomerIds.length > 0
        ? selectedCustomerIds
        : undefined;

      // Try Backend Export API first
      const serverSuccess = await downloadAccountsExportCsv({
        product: selectedProductFilter !== 'All Products' ? selectedProductFilter : undefined,
        search: debouncedSearch.trim() || undefined,
        ids: exportIds,
      });

      if (serverSuccess) {
        toast.success(`Successfully exported customer data from server!`);
        return;
      }

      // Client-side fallback if server is unreachable
      const headers = [
        'Customer ID',
        'Company Name',
        'Industry',
        'Primary Product',
        'Subscribed Plan',
        'Status',
        'Annual Contract ARR',
        'Licensed Users',
        'Contact Person',
        'Official Phone',
        'Official Email',
        'Location',
        'Account Owner',
        'SLA Tier',
        'Contract Start Date',
        'Next Renewal Date',
      ];

      const csvRows = listToExport.map((cust) => [
        `"${(cust.customerId || '').replace(/"/g, '""')}"`,
        `"${(cust.name || '').replace(/"/g, '""')}"`,
        `"${(cust.industry || '').replace(/"/g, '""')}"`,
        `"${(cust.product || '').replace(/"/g, '""')}"`,
        `"${(cust.plan || '').replace(/"/g, '""')}"`,
        `"${(cust.status || '').replace(/"/g, '""')}"`,
        `"${(cust.arr || '').replace(/"/g, '""')}"`,
        `"${cust.users || 0}"`,
        `"${(cust.contactPerson || '').replace(/"/g, '""')}"`,
        `"${(cust.phone || '').replace(/"/g, '""')}"`,
        `"${(cust.email || '').replace(/"/g, '""')}"`,
        `"${(cust.location || '').replace(/"/g, '""')}"`,
        `"${(cust.accountOwner || '').replace(/"/g, '""')}"`,
        `"${(cust.slaTier || '').replace(/"/g, '""')}"`,
        `"${(cust.startDate || '').replace(/"/g, '""')}"`,
        `"${(cust.nextRenewal || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `customer_master_${listToExport.length}_records_${dateStr}.csv`;
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success(`Successfully exported ${listToExport.length} customer record(s) to CSV!`);
    } catch (err) {
      console.error('CSV Export Error:', err);
      toast.error('Failed to export customer data');
    }
  };

  // Filtered customers (queried from server-side filter API, with client fallback guard)
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const query = debouncedSearch.trim().toLowerCase();
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.customerId.toLowerCase().includes(query) ||
        c.contactPerson.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query);

      const matchesProduct =
        selectedProductFilter === 'All Products' ||
        c.product.toLowerCase().includes(selectedProductFilter.toLowerCase()) ||
        selectedProductFilter.toLowerCase().includes(c.product.toLowerCase()) ||
        (selectedProductFilter === 'IT Services' &&
          (c.product.toLowerCase().includes('it') || c.product.toLowerCase().includes('crm'))) ||
        (selectedProductFilter === 'People (HRMS)' &&
          (c.product.toLowerCase().includes('people') || c.product.toLowerCase().includes('hrm')));

      return matchesSearch && matchesProduct;
    });
  }, [customers, debouncedSearch, selectedProductFilter]);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomerIds(filteredCustomers.map((c) => c.id));
    } else {
      setSelectedCustomerIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Industry Icon Renderer matching Image 4
  const renderIndustryIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="h-4 w-4 text-[#5046e5]" />;
      case 'it':
        return <Laptop className="h-4 w-4 text-[#5046e5]" />;
      case 'retail':
        return <ShoppingCart className="h-4 w-4 text-[#5046e5]" />;
      case 'real-estate':
        return <Building2 className="h-4 w-4 text-[#5046e5]" />;
      case 'people':
      default:
        return <Users className="h-4 w-4 text-[#5046e5]" />;
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-10 font-sans text-slate-800 antialiased">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER BAR MATCHING PRODUCT MASTER PATTERN
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#5046e5] border border-purple-100 shadow-xs">
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Customer Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage all customers, enterprise accounts, subscriptions, products and status
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-500 font-medium">Product</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <GraduationCap className="h-4 w-4 text-[#5046e5]" />
              <select
                value={selectedProductFilter}
                onChange={(e) => setSelectedProductFilter(e.target.value)}
                className="bg-transparent border-none outline-hidden font-semibold text-slate-800 cursor-pointer text-xs"
              >
                {availableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleStartAddCustomer}
            className="bg-[#5046e5] hover:bg-[#4338ca] text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleExportCustomers()}
            className="h-9 px-3 text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 rounded-lg font-semibold shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. 5 KPI METRIC CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Total Customers */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-[#5046e5] rounded-xl shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Customers</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{kpiMetrics.total}</p>
          </div>
        </div>

        {/* Metric 2: Active Customers */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500">Active Customers</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{kpiMetrics.active}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Expiring (30 Days) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-[#5046e5] rounded-xl shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Expiring (30 Days)</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{kpiMetrics.expiring}</p>
          </div>
        </div>

        {/* Metric 4: Overdue */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Overdue</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{kpiMetrics.overdue}</p>
          </div>
        </div>

        {/* Metric 5: Total ARR */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-2.5 bg-purple-50 text-[#5046e5] rounded-xl shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total ARR</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{kpiMetrics.formattedArr}</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. SUB-NAVIGATION TABS BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: 'Customer List', icon: LayoutGrid, path: '/customer/master' },
          { label: 'Customer Details', icon: User, path: '/customer/overview' },
          { label: 'Subscriptions', icon: Layers, path: '/customer/subscription-management' },
          { label: 'Usage & Adoption', icon: BarChart2, path: '/customer/usage' },
          { label: 'Renewals & Billing', icon: Calendar, path: '/customer/renewals-expiry' },
          { label: 'Documents', icon: FileText, path: '/customer/master' },
          { label: 'Activity & History', icon: History, path: '/customer/master' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.label;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                setActiveSubTab(tab.label);
                // Keep Customer List, Activity & History, Documents, and Renewals & Billing inline within Customer Master
                if (
                  tab.label !== 'Customer List' &&
                  tab.label !== 'Activity & History' &&
                  tab.label !== 'Documents' &&
                  tab.label !== 'Renewals & Billing'
                ) {
                  router.push(tab.path);
                }
              }}
              className={cn(
                'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-[#5046e5] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-[#5046e5]')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. MAIN 2-COLUMN SPLIT LAYOUT OR ACTIVITY & HISTORY AUDIT VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'Activity & History' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#5046e5] rounded-xl border border-purple-100 shrink-0">
                <History className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Customer Activity & Audit History
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#5046e5]">
                    {auditHistoryData.length} Events
                  </span>
                  {isAuditFetching && (
                    <span className="flex items-center gap-1 text-[11px] text-[#5046e5] font-semibold">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Syncing...
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time audit log of customer account registrations, profile modifications, plan changes, and deletions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    refetchAudit();
                  } catch (_) {}
                }}
                disabled={isAuditFetching}
                className="h-8.5 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer shadow-xs"
              >
                <RefreshCw className={cn('h-3.5 w-3.5 text-slate-500', isAuditFetching && 'animate-spin')} />
                <span>{isAuditFetching ? 'Syncing...' : 'Refresh'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveSubTab('Customer List')}
                className="h-8.5 gap-1.5 text-xs font-semibold bg-[#5046e5] text-white hover:bg-[#4338ca] border-transparent rounded-lg cursor-pointer shadow-xs"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Back to Customer List</span>
              </Button>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* Action Filter Pills */}
              <span className="text-xs font-semibold text-slate-500 mr-1">Action:</span>
              {(['ALL', 'CREATE', 'UPDATE', 'DELETE'] as const).map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setAuditActionFilter(act)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    auditActionFilter === act
                      ? 'bg-[#5046e5] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  )}
                >
                  {act === 'ALL' ? 'All Actions' : act}
                </button>
              ))}

              {/* Customer Selector Dropdown */}
              <div className="flex items-center gap-1.5 ml-0 md:ml-3">
                <span className="text-xs font-semibold text-slate-500">Customer:</span>
                <select
                  value={selectedAuditCustomerId}
                  onChange={(e) => setSelectedAuditCustomerId(e.target.value)}
                  className="h-7.5 px-2.5 text-xs bg-white border border-slate-200/90 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
                >
                  <option value="ALL">All Customers</option>
                  {fullCustomers.map((c) => (
                    <option key={c.id} value={c.customerId || c.id}>
                      {c.name} ({c.customerId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search audit trail..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="pl-8 h-8.5 text-xs bg-white border-slate-200 rounded-lg"
              />
              {auditSearchQuery && (
                <button
                  type="button"
                  onClick={() => setAuditSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Audit History Table */}
          <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Audit ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Customer Record</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Performed By</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3 text-center">Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isAuditLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-[#5046e5]" />
                        <p className="text-xs font-medium text-slate-500">Loading audit history from server...</p>
                      </div>
                    </td>
                  </tr>
                ) : auditHistoryData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <History className="h-8 w-8 text-slate-300" />
                        <p className="font-semibold text-slate-600 text-sm">No Audit History Records Found</p>
                        <p className="text-xs text-slate-400">
                          {selectedAuditCustomerId !== 'ALL' || auditActionFilter !== 'ALL' || auditSearchQuery
                            ? 'Try clearing your filters to see more audit events.'
                            : 'All customer creations, modifications, and deletions will be logged here automatically.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  auditHistoryData.map((item) => {
                    const custName = fullCustomers.find(
                      (c) => c.customerId === item.Record_Id || c.id === item.Record_Id
                    )?.name;
                    const performedByName =
                      typeof item.Created_By === 'object' && item.Created_By !== null
                        ? item.Created_By.username || item.Created_By.email || 'Admin'
                        : typeof item.User_Id === 'object' && item.User_Id !== null
                        ? item.User_Id.username || item.User_Id.email || 'Admin'
                        : 'SuperAdmin';

                    const formattedDate = item.Created_Date
                      ? new Date(item.Created_Date).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—';

                    return (
                      <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                          {item.Audit_Id || `AUD-${item.id}`}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">
                            {custName || 'Account Record'}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {item.Record_Id || '—'}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                              item.Action === 'CREATE' && 'bg-emerald-100 text-emerald-700',
                              item.Action === 'UPDATE' && 'bg-blue-100 text-blue-700',
                              item.Action === 'DELETE' && 'bg-rose-100 text-rose-700'
                            )}
                          >
                            {item.Action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 max-w-[280px] truncate" title={item.Description}>
                          {item.Description || `${item.Action} operation on ${item.Record_Id || 'customer'}`}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium text-slate-800">{performedByName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {item.IP_Address || '127.0.0.1'}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {item.Old_Data || item.New_Data ? (
                            <button
                              type="button"
                              onClick={() => setSelectedAuditDetail(item)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#5046e5] bg-purple-50 hover:bg-purple-100 rounded-md transition-colors cursor-pointer"
                            >
                              View Diff
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'Documents' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#5046e5] rounded-xl border border-purple-100 shrink-0">
                <FileText className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Customer Documents &amp; Contracts
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#5046e5]">
                    {customerDocumentsData.length} Documents
                  </span>
                  {isDocFetching && (
                    <span className="flex items-center gap-1 text-[11px] text-[#5046e5] font-semibold">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Syncing...
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Centralized repository for Master Service Agreements (MSA), NDAs, SLA contracts, compliance certificates, and invoices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    refetchDocuments();
                  } catch (_) {}
                }}
                disabled={isDocFetching}
                className="h-8.5 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer shadow-xs"
              >
                <RefreshCw className={cn('h-3.5 w-3.5 text-slate-500', isDocFetching && 'animate-spin')} />
                <span>{isDocFetching ? 'Syncing...' : 'Refresh'}</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsUploadDocModalOpen(true)}
                className="h-8.5 gap-1.5 text-xs font-semibold bg-[#5046e5] hover:bg-[#4338ca] text-white rounded-lg cursor-pointer shadow-xs"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload Document</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveSubTab('Customer List')}
                className="h-8.5 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer shadow-xs"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Back to Customer List</span>
              </Button>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
              {(['ALL', 'Contract', 'NDA', 'SLA', 'Compliance', 'Invoice'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDocTypeFilter(cat)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    docTypeFilter === cat
                      ? 'bg-[#5046e5] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  )}
                >
                  {cat === 'ALL' ? 'All Types' : cat}
                </button>
              ))}

              {/* Customer Selector Dropdown */}
              <div className="flex items-center gap-1.5 ml-0 md:ml-3">
                <span className="text-xs font-semibold text-slate-500">Customer:</span>
                <select
                  value={selectedDocCustomerId}
                  onChange={(e) => setSelectedDocCustomerId(e.target.value)}
                  className="h-7.5 px-2.5 text-xs bg-white border border-slate-200/90 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
                >
                  <option value="ALL">All Customers</option>
                  {fullCustomers.map((c) => (
                    <option key={c.id} value={c.customerId || c.id}>
                      {c.name} ({c.customerId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search documents by name or notes..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                className="pl-8 h-8.5 text-xs bg-white border-slate-200 rounded-lg"
              />
              {docSearchQuery && (
                <button
                  type="button"
                  onClick={() => setDocSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Documents Table */}
          <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Doc ID</th>
                  <th className="py-2.5 px-3">Document Name</th>
                  <th className="py-2.5 px-3">Customer Account</th>
                  <th className="py-2.5 px-3 text-center">Type</th>
                  <th className="py-2.5 px-3 text-right">Size</th>
                  <th className="py-2.5 px-3">Uploaded Date</th>
                  <th className="py-2.5 px-3">Uploaded By</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isDocLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-[#5046e5]" />
                        <p className="text-xs font-medium text-slate-500">Loading documents from server...</p>
                      </div>
                    </td>
                  </tr>
                ) : customerDocumentsData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="h-8 w-8 text-slate-300" />
                        <p className="font-semibold text-slate-600 text-sm">No Documents Found</p>
                        <p className="text-xs text-slate-400">
                          {selectedDocCustomerId !== 'ALL' || docTypeFilter !== 'ALL' || docSearchQuery
                            ? 'Try clearing your filters or select "All Customers" to see all files.'
                            : 'Upload contracts, SLAs, NDAs, and compliance documents for customer accounts.'}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setIsUploadDocModalOpen(true)}
                          className="mt-2 h-8 text-xs font-semibold bg-[#5046e5] text-white hover:bg-[#4338ca] rounded-lg gap-1.5"
                        >
                          <UploadCloud className="h-3.5 w-3.5" />
                          <span>Upload First Document</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customerDocumentsData.map((doc) => {
                    const matchedCustomer = fullCustomers.find(
                      (c) =>
                        c.customerId === doc.Account_Id?.Account_Id ||
                        c.id === doc.Account_Id?.id ||
                        c.id === String(doc.Account_Id) ||
                        c.customerId === String(doc.Account_Id)
                    );
                    const custName =
                      typeof doc.Account_Id === 'object' && doc.Account_Id !== null
                        ? doc.Account_Id.Organization_Name || doc.Account_Id.name || matchedCustomer?.name
                        : matchedCustomer?.name || 'Customer Account';

                    const custId =
                      typeof doc.Account_Id === 'object' && doc.Account_Id !== null
                        ? doc.Account_Id.Account_Id || matchedCustomer?.customerId
                        : matchedCustomer?.customerId || doc.Account_Id || '—';

                    const formattedDate = doc.Created_Date
                      ? new Date(doc.Created_Date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—';

                    const uploaderName =
                      typeof doc.Created_By === 'object' && doc.Created_By !== null
                        ? doc.Created_By.username || doc.Created_By.email || 'Admin'
                        : 'SuperAdmin';

                    const fileExt = (doc.FileName || '').split('.').pop()?.toUpperCase() || doc.File_Type || 'PDF';

                    return (
                      <tr key={doc.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                          {doc.Document_Id || `DOC-${doc.id}`}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg shrink-0">
                              <FileText className="h-4 w-4 text-[#5046e5]" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-800 block truncate max-w-[220px]" title={doc.FileName}>
                                {doc.FileName || 'Untitled Document'}
                              </span>
                              {doc.Description && (
                                <span className="text-[11px] text-slate-400 block truncate max-w-[220px]">
                                  {doc.Description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-800 block">{custName}</span>
                          <span className="text-[11px] font-mono text-slate-400">{custId}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                              String(doc.File_Type).toLowerCase().includes('contract') && 'bg-purple-100 text-[#5046e5]',
                              String(doc.File_Type).toLowerCase().includes('nda') && 'bg-blue-100 text-blue-700',
                              String(doc.File_Type).toLowerCase().includes('compliance') && 'bg-emerald-100 text-emerald-700',
                              String(doc.File_Type).toLowerCase().includes('invoice') && 'bg-amber-100 text-amber-700',
                              !['contract', 'nda', 'compliance', 'invoice'].some((k) => String(doc.File_Type).toLowerCase().includes(k)) &&
                                'bg-slate-100 text-slate-700'
                            )}
                          >
                            {doc.File_Type || fileExt}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                          {doc.File_Size || '150 KB'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{uploaderName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            {doc.File && (
                              <a
                                href={doc.File}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={doc.FileName}
                                className="p-1 rounded-md text-[#5046e5] hover:bg-purple-50 transition-colors"
                                title="Download File"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedDocDetail(doc)}
                              className="p-1 rounded-md text-slate-600 hover:text-[#5046e5] hover:bg-purple-50 transition-colors cursor-pointer"
                              title="View Document Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id, doc.FileName)}
                              disabled={isDeletingDoc}
                              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'Renewals & Billing' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#5046e5] rounded-xl border border-purple-100 shrink-0">
                <Calendar className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Customer Renewals &amp; Billing Invoices
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#5046e5]">
                    {allUnifiedRenewals.length} Contracts
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                    {filteredInvoices.length} Invoices
                  </span>
                  {(isRenewalFetching || isInvoiceFetching) && (
                    <span className="flex items-center gap-1 text-[11px] text-[#5046e5] font-semibold">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Syncing...
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live tracking of customer renewal dates, expiry schedules, ARR pipelines, and billing invoices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Subview: Schedule vs Invoices */}
              <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setActiveRenewalSubView('schedule')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer',
                    activeRenewalSubView === 'schedule'
                      ? 'bg-white text-[#5046e5] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Renewal Schedule ({allUnifiedRenewals.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRenewalSubView('invoices')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer',
                    activeRenewalSubView === 'invoices'
                      ? 'bg-white text-[#5046e5] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <Receipt className="h-3.5 w-3.5" />
                  <span>Invoices &amp; Billing ({filteredInvoices.length})</span>
                </button>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    refetchRenewals();
                    refetchInvoices();
                  } catch (_) {}
                }}
                disabled={isRenewalFetching || isInvoiceFetching}
                className="h-8.5 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer shadow-xs"
              >
                <RefreshCw
                  className={cn(
                    'h-3.5 w-3.5 text-slate-500',
                    (isRenewalFetching || isInvoiceFetching) && 'animate-spin'
                  )}
                />
                <span>{isRenewalFetching || isInvoiceFetching ? 'Syncing...' : 'Refresh'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveSubTab('Customer List')}
                className="h-8.5 gap-1.5 text-xs font-semibold bg-[#5046e5] text-white hover:bg-[#4338ca] border-transparent rounded-lg cursor-pointer shadow-xs"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Back to Customer List</span>
              </Button>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              {activeRenewalSubView === 'schedule' && (
                <>
                  <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
                  {(['ALL', 'Active', 'Expiring', 'Overdue'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRenewalStatusFilter(st)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                        renewalStatusFilter === st
                          ? 'bg-[#5046e5] text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                      )}
                    >
                      {st === 'ALL'
                        ? 'All Statuses'
                        : st === 'Active'
                        ? `Active (${renewalKpiMetrics.activeCount})`
                        : st === 'Expiring'
                        ? `Expiring (${renewalKpiMetrics.expiringSoon})`
                        : `Overdue (${renewalKpiMetrics.overdueCount})`}
                    </button>
                  ))}
                </>
              )}

              {/* Customer Selector Dropdown */}
              <div className="flex items-center gap-1.5 ml-0 md:ml-2">
                <span className="text-xs font-semibold text-slate-500">Customer:</span>
                <select
                  value={selectedRenewalCustomerId}
                  onChange={(e) => setSelectedRenewalCustomerId(e.target.value)}
                  className="h-7.5 px-2.5 text-xs bg-white border border-slate-200/90 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
                >
                  <option value="ALL">All Customers</option>
                  {fullCustomers.map((c) => (
                    <option key={c.id} value={c.customerId || c.id}>
                      {c.name} ({c.customerId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={
                  activeRenewalSubView === 'schedule'
                    ? 'Search customer, renewal ID, product...'
                    : 'Search invoices by customer, ID, plan...'
                }
                value={renewalSearchQuery}
                onChange={(e) => setRenewalSearchQuery(e.target.value)}
                className="pl-8 h-8.5 text-xs bg-white border-slate-200 rounded-lg"
              />
              {renewalSearchQuery && (
                <button
                  type="button"
                  onClick={() => setRenewalSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* VIEW 1: RENEWAL SCHEDULE TABLE */}
          {activeRenewalSubView === 'schedule' && (
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Renewal ID</th>
                    <th className="py-2.5 px-3">Customer Account</th>
                    <th className="py-2.5 px-3">Product &amp; Plan</th>
                    <th className="py-2.5 px-3">Contract Start</th>
                    <th className="py-2.5 px-3">Renewal Date &amp; Countdown</th>
                    <th className="py-2.5 px-3 text-right">Annual Value (ARR)</th>
                    <th className="py-2.5 px-3 text-center">Renewal Status</th>
                    <th className="py-2.5 px-3 text-center">Payment</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isRenewalLoading ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-[#5046e5]" />
                          <p className="text-xs font-medium text-slate-500">Loading renewal schedule from server...</p>
                        </div>
                      </td>
                    </tr>
                  ) : unifiedRenewals.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Calendar className="h-8 w-8 text-slate-300" />
                          <p className="text-xs font-medium text-slate-600">No renewals found matching your filters</p>
                          <p className="text-[11px] text-slate-400">
                            Try adjusting your search query, status filter, or customer selection.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    unifiedRenewals.map((item, index) => {
                      const isOverdue = item.status === 'Overdue' || item.daysRemaining < 0;
                      const isExpiring = item.status === 'Expiring' || (item.daysRemaining >= 0 && item.daysRemaining <= 30);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 text-slate-400 font-medium">{index + 1}</td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                            {item.renewalId}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900">{item.customerName}</div>
                            <div className="text-[11px] font-mono text-slate-400">{item.customerId || '—'}</div>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-medium text-slate-800">{item.product}</div>
                            <div className="text-[11px] text-slate-500">{item.plan}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                            {item.startDate}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="font-bold text-slate-900">{item.renewalDate}</span>
                            </div>
                            <div className="mt-1">
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide',
                                  isOverdue && 'bg-rose-100 text-rose-700',
                                  isExpiring && !isOverdue && 'bg-amber-100 text-amber-800',
                                  !isOverdue && !isExpiring && 'bg-emerald-100 text-emerald-700'
                                )}
                              >
                                {isOverdue && <AlertTriangle className="h-3 w-3" />}
                                {isExpiring && !isOverdue && <Clock className="h-3 w-3" />}
                                {!isOverdue && !isExpiring && <CheckCircle2 className="h-3 w-3" />}
                                <span>{item.daysLabel}</span>
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {item.renewalAmount}
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                item.status === 'Active' && 'bg-emerald-100 text-emerald-700',
                                item.status === 'Expiring' && 'bg-amber-100 text-amber-800',
                                item.status === 'Overdue' && 'bg-rose-100 text-rose-700'
                              )}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                'inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold',
                                String(item.paymentStatus).toLowerCase().includes('paid')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              )}
                            >
                              {item.paymentStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedRenewalDetail(item)}
                                className="p-1 rounded-md text-slate-600 hover:text-[#5046e5] hover:bg-purple-50 transition-colors cursor-pointer"
                                title="View Renewal Contract Details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRenewalCustomerId(item.customerId || item.customerName);
                                  setActiveRenewalSubView('invoices');
                                }}
                                className="p-1 rounded-md text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                title="View Invoices for Customer"
                              >
                                <Receipt className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 2: BILLING & INVOICES TABLE */}
          {activeRenewalSubView === 'invoices' && (
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice ID</th>
                    <th className="py-2.5 px-3">Customer Name</th>
                    <th className="py-2.5 px-3">Subscription / Plan</th>
                    <th className="py-2.5 px-3">Invoice Date</th>
                    <th className="py-2.5 px-3 text-right">Base Amount</th>
                    <th className="py-2.5 px-3 text-right">Tax Amount</th>
                    <th className="py-2.5 px-3 text-right">Net Amount</th>
                    <th className="py-2.5 px-3 text-center">Payment Status</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isInvoiceLoading ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-[#5046e5]" />
                          <p className="text-xs font-medium text-slate-500">Loading billing invoices from server...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Receipt className="h-8 w-8 text-slate-300" />
                          <p className="text-xs font-medium text-slate-600">No billing invoices found</p>
                          <p className="text-[11px] text-slate-400">
                            No billing invoice records exist in the database for the selected filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const isPaid = inv.Is_Archived === true || String(inv.Payment_Status).toLowerCase() === 'paid';
                      const customerName =
                        inv.Customer_Name ||
                        inv.Customer_Id?.Organization_Name ||
                        inv.Customer_Id?.name ||
                        (typeof inv.Customer_Id === 'string' ? inv.Customer_Id : '—');
                      const planName =
                        inv.Subscription_Name ||
                        inv.Subscription_Id?.Plan_Name ||
                        inv.Subscription_Id?.Subscription_Name ||
                        inv.InvoiceFor ||
                        '—';

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {inv.Invoice_Id || `INV-${inv.id}`}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {customerName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                            {planName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>{inv.Invoice_Date ? String(inv.Invoice_Date).slice(0, 10) : '—'}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                            {inv.InvoiceAmount ? `₹${Number(inv.InvoiceAmount).toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                            {inv.TaxAmount ? `₹${Number(inv.TaxAmount).toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {inv.NetAmount || inv.InvoiceAmount
                              ? `₹${Number(inv.NetAmount || inv.InvoiceAmount).toLocaleString('en-IN')}`
                              : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                              )}
                            >
                              {isPaid ? 'Paid' : 'Unpaid / Due'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceDetail(inv)}
                              className="p-1 rounded-md text-slate-600 hover:text-[#5046e5] hover:bg-purple-50 transition-colors cursor-pointer"
                              title="View Invoice Breakdown"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================
            LEFT COLUMN: TABLE CONTAINER
           ============================================================ */}
        <div
          className={cn(
            'space-y-3 transition-all duration-300',
            isDrawerOpen ? 'lg:col-span-7' : 'lg:col-span-12'
          )}
        >
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            {/* Table Top Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#5046e5]" />
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Customers ({filteredCustomers.length})</span>
                  {isFetching && (
                    <span className="inline-flex items-center text-[10px] text-[#5046e5] font-semibold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 animate-pulse">
                      Filtering...
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-1 text-slate-400 hover:text-[#5046e5] rounded-md transition-colors cursor-pointer"
                  title="Refresh customer data"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin text-[#5046e5]')} />
                </button>
              </div>

              <div className="flex items-center gap-2.5 flex-1 max-w-md ml-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name, code or contact..."
                    className="pl-9 pr-3 py-1.5 text-xs h-9 bg-white border-slate-200 rounded-lg placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#5046e5]"
                  />
                </div>
                {!isDrawerOpen && (
                  <Button
                    type="button"
                    onClick={handleStartAddCustomer}
                    className="h-9 px-3 text-xs bg-[#5046e5] hover:bg-[#4338ca] text-white gap-1 rounded-lg font-semibold shrink-0 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Bulk Action Bar when checkboxes are selected */}
            {selectedCustomerIds.length > 0 && (
              <div className="bg-purple-50/90 border border-purple-200/90 text-slate-800 px-3.5 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-2xs animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                  <span className="h-2 w-2 rounded-full bg-[#5046e5] animate-pulse" />
                  <span>{selectedCustomerIds.length} customer(s) selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportCustomers()}
                    className="h-7.5 px-2.5 text-xs bg-white border-purple-200 text-[#5046e5] hover:bg-purple-100/60 gap-1 rounded-lg font-semibold shadow-2xs cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Selected ({selectedCustomerIds.length})</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkDelete}
                    className="h-7.5 px-2.5 text-xs bg-red-600 hover:bg-red-700 text-white gap-1 rounded-lg font-semibold shadow-2xs cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Selected</span>
                  </Button>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomerIds([])}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded-md cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            {/* Customer Records Table */}
            <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 w-8 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredCustomers.length > 0 &&
                            selectedCustomerIds.length === filteredCustomers.length
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-3.5 w-3.5 cursor-pointer accent-[#5046e5]"
                        />
                      </th>
                      <th className="py-2.5 px-2.5 w-8 text-center font-bold text-slate-900">#</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Customer Name</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Industry</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Product</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Plan</th>
                      <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                      <th className="py-2.5 px-3 text-right font-bold text-slate-900">ARR</th>
                      <th className="py-2.5 px-3 text-center w-24 font-bold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredCustomers.map((cust, idx) => {
                      const isSelected = isDrawerOpen && selectedCustomerId === cust.id;
                      return (
                        <tr
                          key={cust.id}
                          className={cn(
                            'transition-colors group cursor-pointer',
                            isSelected
                              ? 'bg-purple-50/60 font-semibold'
                              : 'hover:bg-slate-50/70'
                          )}
                          onClick={() => handleSelectCustomer(cust)}
                        >
                          <td
                            className="py-2.5 px-3 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCustomerIds.includes(cust.id)}
                              onChange={() => handleSelectOne(cust.id)}
                              className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-3.5 w-3.5 cursor-pointer accent-[#5046e5]"
                            />
                          </td>
                          <td className="py-2.5 px-2.5 text-center text-slate-500 font-semibold text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            <div>
                              <span className="hover:text-[#5046e5] transition-colors block">
                                {cust.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {cust.customerId}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">
                            <div className="flex items-center gap-1.5">
                              {renderIndustryIcon(cust.industryIcon)}
                              <span className="truncate max-w-[110px]">{cust.industry}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#ede9fe] text-[#6d28d9]">
                              {cust.product}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">
                            {cust.plan}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={cn(
                                'inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold',
                                cust.status === 'Active' && 'bg-[#dcfce7] text-[#15803d]',
                                cust.status === 'Expiring' && 'bg-[#fef3c7] text-[#b45309]',
                                cust.status === 'Overdue' && 'bg-[#fee2e2] text-[#b91c1c]'
                              )}
                            >
                              {cust.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                            ₹{cust.arr}
                          </td>
                          <td
                            className="py-2.5 px-3 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => router.push(`/customer/overview?id=${cust.id}`)}
                                title="View Customer Overview"
                                className="p-1 rounded-md text-[#5046e5] hover:bg-purple-50 transition-colors cursor-pointer"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomerId(cust.id);
                                  setDrawerMode('edit_customer');
                                  setFormState({ ...cust });
                                  setIsDrawerOpen(true);
                                }}
                                title="Edit Customer in Panel"
                                className="p-1 rounded-md text-[#5046e5] hover:bg-purple-50 transition-colors cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCustomer(cust.id, cust.name);
                                }}
                                title="Delete Customer"
                                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Users className="h-8 w-8 text-slate-300" />
                            <p className="font-semibold text-slate-600 text-sm">No customers in database</p>
                            <p className="text-xs text-slate-400">
                              Click &ldquo;Add Customer&rdquo; to register your first customer account.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: CREATE / EDIT CUSTOMER DRAWER
            MATCHING PRODUCT MASTER RIGHT-HAND DETAILS PANEL
           ============================================================ */}
        {isDrawerOpen && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            {/* Header: Customer Icon + Name + Badge + Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-purple-50 text-[#5046e5] rounded-xl border border-purple-100 shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {drawerMode === 'add_customer' ? 'New Customer Account' : formState.name || selectedCustomer?.name || 'Customer'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-slate-400">
                      {formState.customerId || selectedCustomer?.customerId || 'CUST-0001'}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.2 rounded-full text-[10px] font-semibold',
                        (formState.status || 'Active') === 'Active'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#fef3c7] text-[#b45309]'
                      )}
                    >
                      {drawerMode === 'add_customer' ? 'Draft' : formState.status || selectedCustomer?.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Collapse side panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Pill Tabs matching Product Master */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {[
                { id: 'profile', label: 'Customer Profile' },
                { id: 'contact', label: 'Contact & HQ' },
                { id: 'subscriptions', label: 'Subscriptions & Plan' },
                { id: 'sla', label: 'SLA & Governance' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDrawerTab(tab.id as any)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap',
                    activeDrawerTab === tab.id
                      ? 'bg-[#5046e5] text-white shadow-xs font-semibold'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Container */}
            <form onSubmit={handleSaveCustomer} className="space-y-3.5 text-xs">
              {drawerMode === 'add_customer' && (
                <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-lg text-xs text-[#5046e5] font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>Creating New Customer Master Record</span>
                </div>
              )}

              {/* TAB 1: CUSTOMER PROFILE */}
              {activeDrawerTab === 'profile' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Customer ID <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formState.customerId || ''}
                        onChange={(e) => setFormState({ ...formState, customerId: e.target.value.toUpperCase() })}
                        placeholder="e.g. CUST-8812"
                        className="h-8.5 font-mono text-xs bg-white border-slate-200 rounded-lg uppercase font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Account Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formState.status || 'Active'}
                        onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                        className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
                      >
                        <option value="Active">Active</option>
                        <option value="Expiring">Expiring Soon</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Prospect">Prospect</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      Company Legal Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formState.name || ''}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Bright Future School or Euro Textiles Pvt Ltd"
                      className="h-8.5 text-xs bg-white border-slate-200 rounded-lg font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Industry / Domain</label>
                      <select
                        value={formState.industry || 'Education'}
                        onChange={(e) => setFormState({ ...formState, industry: e.target.value })}
                        className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
                      >
                        <option value="Education">Education</option>
                        <option value="IT Services">IT Services</option>
                        <option value="Retail">Retail</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Textiles & Manufacturing">Textiles &amp; Manufacturing</option>
                        <option value="Healthcare">Healthcare</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Account Classification</label>
                      <select
                        value={formState.location?.includes('Enterprise') ? 'Enterprise' : 'Mid-Market'}
                        onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                        className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
                      >
                        <option value="Enterprise">Enterprise Tier 1</option>
                        <option value="Mid-Market">Mid-Market</option>
                        <option value="SMB">SMB Fast-Track</option>
                        <option value="Strategic Partner">Strategic Partner</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT & HQ */}
              {activeDrawerTab === 'contact' && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      Primary Contact Person <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formState.contactPerson || ''}
                      onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                      placeholder="e.g. Vikram Patel – Managing Director"
                      className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Official Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={formState.email || ''}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="contact@company.com"
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Contact Phone</label>
                      <Input
                        value={formState.phone || ''}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Headquarters Address</label>
                    <Textarea
                      rows={2}
                      value={formState.location || ''}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      placeholder="Street address, business park, city, country..."
                      className="text-xs bg-white border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SUBSCRIPTIONS & PLAN */}
              {activeDrawerTab === 'subscriptions' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Primary Product</label>
                      <select
                        value={formState.product || 'Education'}
                        onChange={(e) => setFormState({ ...formState, product: e.target.value })}
                        className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
                      >
                        <option value="Education">Pegatto Education</option>
                        <option value="IT">Pegatto IT</option>
                        <option value="Retail">Pegatto Retail</option>
                        <option value="CRM">Pegatto CRM</option>
                        <option value="People">Pegatto People</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Subscribed Plan</label>
                      <select
                        value={formState.plan || 'Professional'}
                        onChange={(e) => setFormState({ ...formState, plan: e.target.value })}
                        className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
                      >
                        <option value="Starter">Starter</option>
                        <option value="Standard">Standard</option>
                        <option value="Professional">Professional</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Annual Contract ARR (₹)</label>
                      <Input
                        value={formState.arr || ''}
                        onChange={(e) => setFormState({ ...formState, arr: e.target.value })}
                        placeholder="e.g. 18,00,000"
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Licensed User Seats</label>
                      <Input
                        type="number"
                        value={formState.users || 100}
                        onChange={(e) => setFormState({ ...formState, users: Number(e.target.value) })}
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Contract Start Date</label>
                      <Input
                        value={formState.startDate || '01 Jan 2026'}
                        onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Next Renewal Date</label>
                      <Input
                        value={formState.nextRenewal || '31 Dec 2026'}
                        onChange={(e) => setFormState({ ...formState, nextRenewal: e.target.value })}
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SLA & GOVERNANCE */}
              {activeDrawerTab === 'sla' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Account Owner (VP/Director)</label>
                      <Input
                        value={formState.accountOwner || ''}
                        onChange={(e) => setFormState({ ...formState, accountOwner: e.target.value })}
                        placeholder="e.g. Ananya Sharma (VP Accounts)"
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">SLA Tier</label>
                      <select
                        value={formState.slaTier || '24/7 Mission-Critical Gold'}
                        onChange={(e) => setFormState({ ...formState, slaTier: e.target.value })}
                        className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
                      >
                        <option value="24/7 Mission-Critical Gold">24/7 Mission-Critical Gold</option>
                        <option value="Priority 99.9% Silver">Priority 99.9% Silver</option>
                        <option value="Standard Business Hours">Standard Business Hours</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 block">Slack Connect Channel</span>
                      <span className="text-[11px] text-slate-400">Direct dedicated engineering support channel</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-4 w-4"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Internal Account Notes</label>
                    <Textarea
                      rows={2}
                      value={formState.notes || ''}
                      onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                      placeholder="Add strategic notes, account owner notes or milestones..."
                      className="text-xs bg-white border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Drawer Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (drawerMode === 'add_customer') {
                      setDrawerMode('edit_customer');
                    } else {
                      setIsDrawerOpen(false);
                    }
                  }}
                  className="h-8.5 px-3.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreating || isUpdating}
                  className="h-8.5 px-4 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isCreating || isUpdating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {isCreating
                      ? 'Creating...'
                      : isUpdating
                      ? 'Updating...'
                      : drawerMode === 'add_customer'
                      ? 'Create Customer'
                      : 'Update Customer'}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      )}

      {/* Audit Detail Diff Modal */}
      <Dialog open={!!selectedAuditDetail} onOpenChange={(open) => !open && setSelectedAuditDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                  selectedAuditDetail?.Action === 'CREATE' && 'bg-emerald-100 text-emerald-700',
                  selectedAuditDetail?.Action === 'UPDATE' && 'bg-blue-100 text-blue-700',
                  selectedAuditDetail?.Action === 'DELETE' && 'bg-rose-100 text-rose-700'
                )}
              >
                {selectedAuditDetail?.Action}
              </span>
              <DialogTitle className="text-base font-bold text-slate-900">
                Audit Record: {selectedAuditDetail?.Audit_Id || `AUD-${selectedAuditDetail?.id}`}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Customer: {selectedAuditDetail?.Record_Id} &bull; Recorded on{' '}
              {selectedAuditDetail?.Created_Date ? new Date(selectedAuditDetail.Created_Date).toLocaleString('en-IN') : '—'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Performed By</span>
                <span className="font-semibold text-slate-800">
                  {typeof selectedAuditDetail?.Created_By === 'object' && selectedAuditDetail?.Created_By !== null
                    ? selectedAuditDetail.Created_By.username || selectedAuditDetail.Created_By.email || 'Admin'
                    : 'SuperAdmin'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">IP Address</span>
                <span className="font-mono text-slate-800">{selectedAuditDetail?.IP_Address || '127.0.0.1'}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Status</span>
                <span className="font-semibold text-emerald-600">{selectedAuditDetail?.Action_Status || 'Success'}</span>
              </div>
            </div>

            {selectedAuditDetail?.Description && (
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="text-[11px] font-semibold text-[#5046e5] block mb-0.5">Operation Summary</span>
                <p className="text-slate-700 font-medium">{selectedAuditDetail.Description}</p>
              </div>
            )}

            {/* Changed Fields / New Data */}
            {selectedAuditDetail?.New_Data && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 text-xs">New Data Payload</span>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56">
                  {JSON.stringify(selectedAuditDetail.New_Data, null, 2)}
                </pre>
              </div>
            )}

            {/* Old Data Payload if available */}
            {selectedAuditDetail?.Old_Data && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 text-xs">Previous Data (Before Change)</span>
                <pre className="p-3 bg-slate-100 text-slate-800 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-200">
                  {JSON.stringify(selectedAuditDetail.Old_Data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Customer Document Modal */}
      <Dialog open={isUploadDocModalOpen} onOpenChange={setIsUploadDocModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-[#5046e5]" />
              <span>Upload Customer Document</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Upload agreements, contracts, NDAs, or compliance certificates linked directly to a customer account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadDocumentSubmit} className="space-y-3.5 pt-1">
            {/* Customer Account Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Customer Account <span className="text-red-500">*</span>
              </label>
              <select
                value={uploadFormData.accountId}
                onChange={(e) => setUploadFormData({ ...uploadFormData, accountId: e.target.value })}
                required
                className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
              >
                <option value="">Select Customer Account...</option>
                {fullCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.customerId})
                  </option>
                ))}
              </select>
            </div>

            {/* Document Title / File Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Document Title / Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Master Services Agreement 2026.pdf"
                value={uploadFormData.fileName}
                onChange={(e) => setUploadFormData({ ...uploadFormData, fileName: e.target.value })}
                required
                className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
              />
            </div>

            {/* Document Category / Type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Document Category / Type</label>
              <select
                value={uploadFormData.fileType}
                onChange={(e) => setUploadFormData({ ...uploadFormData, fileType: e.target.value })}
                className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
              >
                <option value="Contract">Contract / Master Service Agreement</option>
                <option value="NDA">Non-Disclosure Agreement (NDA)</option>
                <option value="SLA">Service Level Agreement (SLA)</option>
                <option value="Compliance">Security & Compliance Certificate</option>
                <option value="Invoice">Invoice / Billing Statement</option>
                <option value="Other">Other Supporting Document</option>
              </select>
            </div>

            {/* File Chooser */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">File Attachment</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-[#5046e5] rounded-xl p-4 text-center transition-colors">
                <input
                  type="file"
                  id="doc-file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      setUploadFormData((prev) => ({
                        ...prev,
                        file,
                        fileName: prev.fileName ? prev.fileName : file.name,
                      }));
                    }
                  }}
                />
                <label htmlFor="doc-file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
                  <UploadCloud className="h-6 w-6 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">
                    {uploadFormData.file ? uploadFormData.file.name : 'Click to select a file'}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, DOCX, XLSX, ZIP, PNG, JPG (up to 25MB)</span>
                </label>
              </div>
            </div>

            {/* Description Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Description / Notes</label>
              <Textarea
                placeholder="Optional notes regarding the document or contract terms..."
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                rows={2}
                className="text-xs bg-white border-slate-200 rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadDocModalOpen(false)}
                className="h-8.5 px-3.5 text-xs font-semibold border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUploadingDoc}
                className="h-8.5 px-4 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isUploadingDoc ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                <span>{isUploadingDoc ? 'Uploading...' : 'Upload Document'}</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Document Details Modal */}
      <Dialog open={!!selectedDocDetail} onOpenChange={(open) => !open && setSelectedDocDetail(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#5046e5]" />
              <span>Document Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedDocDetail && (
            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Document ID:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedDocDetail.Document_Id || `DOC-${selectedDocDetail.id}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">File Name:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">{selectedDocDetail.FileName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">File Type:</span>
                  <span className="font-semibold text-[#5046e5]">{selectedDocDetail.File_Type || 'PDF'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">File Size:</span>
                  <span className="font-mono text-slate-700">{selectedDocDetail.File_Size || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Uploaded Date:</span>
                  <span className="text-slate-700">{selectedDocDetail.Created_Date || '—'}</span>
                </div>
              </div>

              {selectedDocDetail.Description && (
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <span className="text-[11px] font-semibold text-[#5046e5] block mb-0.5">Description</span>
                  <p className="text-slate-700 font-medium">{selectedDocDetail.Description}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {selectedDocDetail.File && (
                  <a
                    href={selectedDocDetail.File}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={selectedDocDetail.FileName}
                    className="inline-flex items-center gap-1.5 h-8.5 px-3.5 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download File</span>
                  </a>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDocDetail(null)}
                  className="h-8.5 px-3.5 text-xs font-semibold border-slate-200 text-slate-700"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Renewal Details Modal */}
      <Dialog open={!!selectedRenewalDetail} onOpenChange={(open) => !open && setSelectedRenewalDetail(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#5046e5]" />
              <span>Contract Renewal Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedRenewalDetail && (
            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Renewal ID:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedRenewalDetail.renewalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Customer Name:</span>
                  <span className="font-semibold text-slate-900">{selectedRenewalDetail.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Customer ID:</span>
                  <span className="font-mono text-slate-700">{selectedRenewalDetail.customerId || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Product &amp; Plan:</span>
                  <span className="font-semibold text-[#5046e5]">
                    {selectedRenewalDetail.product} ({selectedRenewalDetail.plan})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Contract Start:</span>
                  <span className="text-slate-700">{selectedRenewalDetail.startDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Renewal Date:</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{selectedRenewalDetail.renewalDate}</span>
                    <span className="text-[11px] font-semibold text-purple-600">{selectedRenewalDetail.daysLabel}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Annual Value (ARR):</span>
                  <span className="font-mono font-bold text-slate-900">{selectedRenewalDetail.renewalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#5046e5]">
                    {selectedRenewalDetail.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Payment Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {selectedRenewalDetail.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const custName = selectedRenewalDetail.customerName;
                    setSelectedRenewalDetail(null);
                    setSelectedRenewalCustomerId(selectedRenewalDetail.customerId || custName);
                    setActiveRenewalSubView('invoices');
                  }}
                  className="h-8.5 px-3.5 text-xs font-semibold text-[#5046e5] border-purple-200 hover:bg-purple-50 cursor-pointer"
                >
                  <Receipt className="h-3.5 w-3.5 mr-1" />
                  View Customer Invoices
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRenewalDetail(null)}
                  className="h-8.5 px-3.5 text-xs font-semibold border-slate-200 text-slate-700 cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Details Modal */}
      <Dialog open={!!selectedInvoiceDetail} onOpenChange={(open) => !open && setSelectedInvoiceDetail(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-[#5046e5]" />
              <span>Billing Invoice Breakdown</span>
            </DialogTitle>
          </DialogHeader>

          {selectedInvoiceDetail && (
            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Invoice Number:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedInvoiceDetail.Invoice_Id || `INV-${selectedInvoiceDetail.id}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Customer:</span>
                  <span className="font-semibold text-slate-900">{selectedInvoiceDetail.Customer_Name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Subscription / Product:</span>
                  <span className="font-medium text-slate-700">{selectedInvoiceDetail.Subscription_Name || 'Standard Enterprise'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Invoice Date:</span>
                  <span className="text-slate-700">{selectedInvoiceDetail.Invoice_Date || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Payment Terms:</span>
                  <span className="text-slate-700">{selectedInvoiceDetail.Payment_Terms || 'Net 30'}</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Base Amount:</span>
                  <span>₹{(Number(selectedInvoiceDetail.InvoiceAmount) || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax Amount:</span>
                  <span>₹{(Number(selectedInvoiceDetail.TaxAmount) || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-purple-200/60 text-sm">
                  <span>Net Total Amount:</span>
                  <span className="text-[#5046e5]">
                    ₹{(Number(selectedInvoiceDetail.NetAmount || selectedInvoiceDetail.InvoiceAmount) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-600">Payment Status:</span>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    selectedInvoiceDetail.Is_Archived === true
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-800'
                  )}
                >
                  {selectedInvoiceDetail.Is_Archived === true ? 'Paid' : 'Unpaid / Pending'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoiceDetail(null)}
                  className="h-8.5 px-3.5 text-xs font-semibold border-slate-200 text-slate-700 cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          5. BOTTOM 3 CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
        {/* Card 1: Customer Overview Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4.5 w-4.5 text-[#5046e5]" />
              <h4 className="text-sm font-bold text-slate-900">Customer Overview</h4>
            </div>
            {(isFetching || isKpiFetching) && (
              <span className="flex items-center gap-1 text-[11px] text-[#5046e5] font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-[10px]">Syncing</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            {/* SVG Donut Chart */}
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {kpiMetrics.total > 0 && kpiMetrics.activePct > 0 && (
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${kpiMetrics.activePct}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                )}
                {kpiMetrics.total > 0 && kpiMetrics.expiringPct > 0 && (
                  <path
                    className="text-amber-500"
                    strokeDasharray={`${kpiMetrics.expiringPct}, 100`}
                    strokeDashoffset={`-${kpiMetrics.activePct}`}
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                )}
                {kpiMetrics.total > 0 && kpiMetrics.overduePct > 0 && (
                  <path
                    className="text-rose-500"
                    strokeDasharray={`${kpiMetrics.overduePct}, 100`}
                    strokeDashoffset={`-${kpiMetrics.activePct + kpiMetrics.expiringPct}`}
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900 leading-none">
                  {kpiMetrics.total}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Customers</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
                <span className="text-slate-700 font-medium">
                  Active ({kpiMetrics.active}) – {kpiMetrics.activePct}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-500 shrink-0" />
                <span className="text-slate-700 font-medium">
                  Expiring ({kpiMetrics.expiring}) – {kpiMetrics.expiringPct}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-rose-500 shrink-0" />
                <span className="text-slate-700 font-medium">
                  Overdue ({kpiMetrics.overdue}) – {kpiMetrics.overduePct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Products Adoption */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#5046e5]" />
              <h4 className="text-sm font-bold text-slate-900">
                Products Adoption (Active Customers)
              </h4>
            </div>
            {(isFetching || isKpiFetching) && (
              <span className="flex items-center gap-1 text-[11px] text-[#5046e5] font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
              </span>
            )}
          </div>

          <div className="space-y-2.5 text-xs">
            {productAdoption.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex items-center gap-2.5">
                  <div className="w-24 flex items-center gap-1.5 shrink-0 text-slate-700 font-medium">
                    <Icon className="h-3.5 w-3.5 text-[#5046e5] shrink-0" />
                    <span className="truncate">{p.label}</span>
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#5046e5] h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                  <span className="w-7 text-right font-bold text-slate-800 text-[11px]">
                    {p.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Zap className="h-4.5 w-4.5 text-[#5046e5]" />
            <h4 className="text-sm font-bold text-slate-900">Quick Actions</h4>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/customer/subscription-management')}
              className="w-full h-9 text-xs font-semibold border-slate-200/90 hover:border-[#5046e5] hover:bg-purple-50/40 text-slate-800 justify-start gap-2.5 rounded-xl cursor-pointer"
            >
              <Users className="h-4 w-4 text-[#5046e5]" />
              <span>Manage Subscription</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/customer/renewals-expiry')}
              className="w-full h-9 text-xs font-semibold border-slate-200/90 hover:border-[#5046e5] hover:bg-purple-50/40 text-slate-800 justify-start gap-2.5 rounded-xl cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-[#5046e5]" />
              <span>Renewal Reminder</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/customer/usage')}
              className="w-full h-9 text-xs font-semibold border-slate-200/90 hover:border-[#5046e5] hover:bg-purple-50/40 text-slate-800 justify-start gap-2.5 rounded-xl cursor-pointer"
            >
              <BarChart2 className="h-4 w-4 text-[#5046e5]" />
              <span>View Usage</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleExportCustomers()}
              className="w-full h-9 text-xs font-semibold border-slate-200/90 hover:border-[#5046e5] hover:bg-purple-50/40 text-slate-800 justify-start gap-2.5 rounded-xl cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#5046e5]" />
              <span>Download Customer List</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
