'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  GraduationCap,
  Share2,
  Calendar,
  Layers,
  BarChart2,
  BarChart3,
  Headphones,
  FileText,
  History,
  Clock,
  HeartPulse,
  TrendingUp,
  RotateCw,
  Zap,
  ShoppingCart,
  Ticket,
  ChevronDown,
  SlidersHorizontal,
  Check,
  IndianRupee,
  Upload,
  MessageSquare,
  ShieldCheck,
  Download,
  ExternalLink,
  Plus,
  AlertCircle,
  FolderOpen,
  Loader2,
  ArrowLeft,
  Laptop,
  RefreshCw,
} from 'lucide-react';
import { INITIAL_CUSTOMERS, CustomerRecord } from '@/components/customer/customerData';
import {
  useGetAccountFullListQuery,
  useGetSubscriptionsListQuery,
  useGetRenewalDueListQuery,
  useGetInvoiceFullListQuery,
  useGetCustomerDocumentListQuery,
  useGetCustomerAuditHistoryQuery,
  useGetTicketsListQuery,
  useGetUsageAnalyticsQuery,
  useGetCustomerOverviewAnalyticsQuery,
} from '@/service/api/superAdminService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const mapAccountToCustomer = (acc: any): CustomerRecord => {
  const industryStr = String(acc.Industry || 'IT Services').toLowerCase();
  let industryIcon: CustomerRecord['industryIcon'] = 'it';
  if (industryStr.includes('edu')) industryIcon = 'education';
  else if (industryStr.includes('retail')) industryIcon = 'retail';
  else if (industryStr.includes('real')) industryIcon = 'real-estate';
  else if (industryStr.includes('people') || industryStr.includes('hrm')) industryIcon = 'people';

  const rawArr = acc.Annual_Contract_ARR || acc.arr || '12,00,000';
  const numericArr = Number(String(rawArr).replace(/[^0-9]/g, '')) || 1200000;

  const productName = acc.Primary_Product || 'Pegatto CRM';
  const planName = acc.Subscribed_Plan || 'Professional';

  return {
    id: String(acc.id || acc.Account_Id || ''),
    name: acc.Organization_Name || acc.name || 'Unnamed Customer',
    customerId: acc.Account_Id || (acc.id ? `ACC-${acc.id}` : 'CUST-0001'),
    industry: acc.Industry || 'Information Technology',
    industryIcon,
    product: productName,
    plan: planName,
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
    healthScore: Number(acc.healthScore || 92),
    healthStatus: acc.healthStatus || 'Healthy',
    subscribedProducts: [
      {
        name: productName,
        edition: planName,
        status: 'Active',
        icon: industryIcon === 'education' ? 'graduation-cap' : 'laptop',
      },
    ],
    addonsList: ['AI Lead Scoring', 'WhatsApp CRM', 'Analytics Pro'],
    accountOwner: acc.Account_Owner || 'Ananya Sharma (VP Accounts)',
    slaTier: acc.SLA_Tier || '24/7 Mission-Critical Gold',
    notes: acc.Description || '',
  };
};

export function CustomerOverviewScreen({ customerId }: { customerId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetId = customerId || searchParams?.get('id') || searchParams?.get('customerId');

  // Fetch live accounts from database
  const {
    data: accountsData = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAccountFullListQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Map backend accounts to CustomerRecord
  const liveCustomers = useMemo<CustomerRecord[]>(() => {
    if (Array.isArray(accountsData) && accountsData.length > 0) {
      return accountsData.map(mapAccountToCustomer);
    }
    return [];
  }, [accountsData]);

  // Find customer by targetId or default to the first real customer in the database
  const customer: CustomerRecord | undefined = useMemo(() => {
    if (liveCustomers.length > 0) {
      if (targetId) {
        const found = liveCustomers.find(
          (c) =>
            String(c.id).toLowerCase() === String(targetId).toLowerCase() ||
            String(c.customerId).toLowerCase() === String(targetId).toLowerCase()
        );
        if (found) return found;
      }
      return liveCustomers[0];
    }
    // Fallback to initial mock customer only if database has not returned yet
    if (INITIAL_CUSTOMERS.length > 0) {
      if (targetId) {
        const found = INITIAL_CUSTOMERS.find(
          (c) =>
            c.id.toLowerCase() === String(targetId).toLowerCase() ||
            c.customerId.toLowerCase() === String(targetId).toLowerCase()
        );
        if (found) return found;
      }
      return INITIAL_CUSTOMERS[0];
    }
    return undefined;
  }, [liveCustomers, targetId]);

  const daysUntilRenewal = useMemo(() => {
    if (!customer?.nextRenewal) return null;
    const renewalDate = new Date(customer.nextRenewal);
    if (isNaN(renewalDate.getTime())) return null;
    const diffTime = renewalDate.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [customer?.nextRenewal]);

  // 1. Live Subscriptions API - Filtered for the particular account
  const {
    data: allSubscriptions = [],
    isLoading: isSubsLoading,
    isFetching: isSubsFetching,
    refetch: refetchSubscriptions,
  } = useGetSubscriptionsListQuery(
    customer?.customerId ? { customerId: customer.customerId } : undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const customerSubscriptions = useMemo(() => {
    if (!customer || !Array.isArray(allSubscriptions)) return [];
    return allSubscriptions.filter((sub: any) => {
      const subCustId = String(sub.customer_id?.Account_Id || sub.customer_id?.id || sub.customer_id || sub.account_id || '');
      const subCustName = String(sub.customer_name || sub.Customer_Name || '').toLowerCase();
      return (
        (customer.customerId && subCustId.includes(customer.customerId)) ||
        (customer.name && subCustName.includes(customer.name.toLowerCase()))
      );
    });
  }, [allSubscriptions, customer]);

  // 2. Live Renewal Schedule API
  const {
    data: renewalsData = [],
    isLoading: isRenewalsLoading,
    isFetching: isRenewalsFetching,
    refetch: refetchRenewals,
  } = useGetRenewalDueListQuery(
    customer?.customerId ? { customerId: customer.customerId } : undefined,
    { refetchOnMountOrArgChange: true }
  );

  // 3. Live Invoices & Billing API
  const {
    data: invoicesData = [],
    isLoading: isInvoicesLoading,
    isFetching: isInvoicesFetching,
    refetch: refetchInvoices,
  } = useGetInvoiceFullListQuery(
    customer?.customerId ? { customerId: customer.customerId } : undefined,
    { refetchOnMountOrArgChange: true }
  );

  // 4. Live Customer Documents API
  const {
    data: documentsData = [],
    isLoading: isDocumentsLoading,
    isFetching: isDocumentsFetching,
    refetch: refetchDocuments,
  } = useGetCustomerDocumentListQuery(
    customer?.customerId ? { accountId: customer.customerId } : undefined,
    { refetchOnMountOrArgChange: true }
  );

  // 5. Live Activity & Audit History API
  const {
    data: auditData = [],
    isLoading: isAuditLoading,
    isFetching: isAuditFetching,
    refetch: refetchAudit,
  } = useGetCustomerAuditHistoryQuery(
    customer?.customerId ? { recordId: customer.customerId } : undefined,
    { refetchOnMountOrArgChange: true }
  );

  // 6. Live Tickets API
  const {
    data: ticketsData = [],
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
    refetch: refetchTickets,
  } = useGetTicketsListQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const customerTickets = useMemo(() => {
    if (!customer || !Array.isArray(ticketsData)) return [];
    return ticketsData.filter((t: any) => {
      const tCust = String(t.Account_Id?.Account_Id || t.Account_Id?.id || t.Account_Id || t.Customer_Name || '').toLowerCase();
      return (
        (customer.customerId && tCust.includes(customer.customerId.toLowerCase())) ||
        (customer.name && tCust.includes(customer.name.toLowerCase()))
      );
    });
  }, [ticketsData, customer]);

  // 7. Live Usage Telemetry API
  const { data: usageAnalytics } = useGetUsageAnalyticsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // 8. Live Customer Overview Analytics & KPI Charts API
  const {
    data: overviewAnalytics,
    isLoading: isOverviewAnalyticsLoading,
    isFetching: isOverviewAnalyticsFetching,
    refetch: refetchOverviewAnalytics,
  } = useGetCustomerOverviewAnalyticsQuery(
    customer?.customerId ? { customerId: customer.customerId } : undefined,
    { refetchOnMountOrArgChange: true }
  );

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'subscriptions'
    | 'usage'
    | 'tickets'
    | 'billing'
    | 'documents'
    | 'activity'
  >('overview');

  const [billingSubView, setBillingSubView] = useState<'schedule' | 'invoices'>('schedule');

  // Trigger explicit API network calls on button clicks
  const handleTabClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    if (tabId === 'overview') {
      refetchOverviewAnalytics();
    } else if (tabId === 'billing') {
      refetchRenewals();
      refetchInvoices();
    } else if (tabId === 'documents') {
      refetchDocuments();
    } else if (tabId === 'activity') {
      refetchAudit();
    } else if (tabId === 'subscriptions') {
      refetchSubscriptions();
    } else if (tabId === 'tickets') {
      refetchTickets();
    }
  };

  const [dateRange, setDateRange] = useState('Last 12 Months');
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'subscriptions', label: 'Subscriptions', icon: Layers },
    { id: 'usage', label: 'Usage & Adoption', icon: BarChart2 },
    { id: 'tickets', label: 'Support & Tickets', icon: Headphones },
    { id: 'billing', label: 'Renewal & Billing', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'activity', label: 'Activity History', icon: History },
  ] as const;

  const handleAction = (actionName: string) => {
    setShowActionsMenu(false);
    toast.info(`Triggered: ${actionName} for ${customer?.name || 'Customer'}`);
  };

  if (isLoading && !customer) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[450px] gap-3 text-slate-500">
        <Loader2 className="h-9 w-9 animate-spin text-[#6366f1]" />
        <p className="text-sm font-semibold">Loading live customer details from database...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-10 text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-purple-50 text-[#6366f1] mx-auto flex items-center justify-center">
          <Users className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Customer Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested customer could not be found in the database. Please select a customer from the customer master list.
        </p>
        <button
          type="button"
          onClick={() => router.push('/customer/master')}
          className="inline-flex items-center gap-2 bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Customer List</span>
        </button>
      </div>
    );
  }

  // Dynamic Chart Points & Guidelines for Usage Trend Area/Line Chart from Live API
  const trendMaxVal = Math.max(1, overviewAnalytics?.usage_trend?.max_val || customer?.users || 50);

  const gridSteps = [
    { val: trendMaxVal, y: 15 },
    { val: Math.round(trendMaxVal * 0.75), y: 45 },
    { val: Math.round(trendMaxVal * 0.5), y: 75 },
    { val: Math.round(trendMaxVal * 0.25), y: 105 },
    { val: 0, y: 135 },
  ];

  const chartPoints = (
    overviewAnalytics?.usage_trend?.monthly_data &&
    overviewAnalytics.usage_trend.monthly_data.length > 0
      ? overviewAnalytics.usage_trend.monthly_data
      : [
          { month: 'Jan', active_users: 15 },
          { month: 'Feb', active_users: 18 },
          { month: 'Mar', active_users: 20 },
          { month: 'Apr', active_users: 23 },
          { month: 'May', active_users: 26 },
          { month: 'Jun', active_users: 29 },
          { month: 'Jul', active_users: 31 },
          { month: 'Aug', active_users: 33 },
          { month: 'Sep', active_users: 34 },
          { month: 'Oct', active_users: 37 },
          { month: 'Nov', active_users: 39 },
          { month: 'Dec', active_users: 42 },
        ]
  ).map((item, idx) => {
    const x = 45 + idx * 50;
    const ratio = Math.min(1, Math.max(0, item.active_users / trendMaxVal));
    const y = Math.round(135 - ratio * 110);
    return { ...item, x, y };
  });

  const polylinePoints = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const polygonPoints = `45,135 ${polylinePoints} 595,135`;

  // Customer Health Score & Checklist from Live API
  const healthScore = overviewAnalytics?.customer_health?.score ?? 92;
  const healthStatus = overviewAnalytics?.customer_health?.status || 'Healthy';
  const healthChecklist = overviewAnalytics?.customer_health?.checklist || [
    { label: 'High Adoption', passed: true },
    { label: 'No Open Critical Tickets', passed: true },
    { label: 'On-time Payments', passed: true },
    { label: 'Renewal Likely', passed: true },
  ];
  const strokeDashoffset = 2 * Math.PI * 40 * (1 - Math.min(100, Math.max(0, healthScore)) / 100);

  // Usage & Adoption Metrics from Live API
  const activeUsersVal =
    overviewAnalytics?.usage_and_adoption?.active_users?.current ??
    (customer?.activeUsers || Math.min(customer?.users || 50, 42));
  const activeUsersTotal =
    overviewAnalytics?.usage_and_adoption?.active_users?.total ?? (customer?.users || 50);
  const activeUsersPct =
    overviewAnalytics?.usage_and_adoption?.active_users?.pct ??
    Math.round((activeUsersVal / Math.max(activeUsersTotal, 1)) * 100);

  const dailyLoginsVal =
    overviewAnalytics?.usage_and_adoption?.daily_active_logins?.current ??
    (customer?.activeUsers || Math.min(customer?.users || 50, 38));
  const dailyLoginsTotal =
    overviewAnalytics?.usage_and_adoption?.daily_active_logins?.total ?? (customer?.users || 50);
  const dailyLoginsPct =
    overviewAnalytics?.usage_and_adoption?.daily_active_logins?.pct ??
    Math.round((dailyLoginsVal / Math.max(dailyLoginsTotal, 1)) * 100);

  const modulesUsedVal = overviewAnalytics?.usage_and_adoption?.key_modules_used?.current ?? 6;
  const modulesUsedTotal = overviewAnalytics?.usage_and_adoption?.key_modules_used?.total ?? 10;
  const modulesUsedPct =
    overviewAnalytics?.usage_and_adoption?.key_modules_used?.pct ??
    Math.round((modulesUsedVal / modulesUsedTotal) * 100);

  // Subscribed products and addons from Live API
  const liveSubscribedProducts =
    overviewAnalytics?.subscribed_products && overviewAnalytics.subscribed_products.length > 0
      ? overviewAnalytics.subscribed_products
      : customer?.subscribedProducts || [];
  const liveAddonsList =
    overviewAnalytics?.addons && overviewAnalytics.addons.length > 0
      ? overviewAnalytics.addons
      : customer?.addonsList || ['AI Lead Scoring', 'WhatsApp CRM', 'Analytics Pro'];

  // Subscription Summary from Live API
  const subSummary = overviewAnalytics?.subscription_summary;
  const currentPlanDisplay = subSummary?.plan || customer?.plan || 'Professional';
  const annualArrDisplay =
    subSummary?.arr_formatted ||
    `₹${Number(customer?.arrValue || 9000000).toLocaleString('en-IN')}`;
  const nextRenewalDisplay = subSummary?.next_renewal || customer?.nextRenewal || '2027-11-30';
  const renewalLikelihoodDisplay =
    subSummary?.renewal_likelihood || `Renewal Likely (${healthScore}%)`;

  return (
    <div className="w-full space-y-4 pb-14 font-sans text-slate-800 antialiased">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER & ACTIONS BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Breadcrumbs */}
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6366f1] border border-purple-100 shadow-xs">
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Customer Overview
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span
                className="hover:text-slate-800 cursor-pointer"
                onClick={() => router.push('/customer/master')}
              >
                Customer Management
              </span>
              <span>&gt;</span>
              <span className="text-slate-700 font-semibold">Customer Overview</span>
            </div>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Customer Switcher Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs cursor-pointer hover:bg-slate-50">
              <Users className="h-3.5 w-3.5 text-[#6366f1]" />
              <select
                value={customer.customerId}
                onChange={(e) => {
                  router.push(`/customer/overview?id=${e.target.value}`);
                }}
                className="appearance-none bg-transparent pr-4 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                {liveCustomers.map((c) => (
                  <option key={c.customerId} value={c.customerId}>
                    {c.name} ({c.customerId})
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs cursor-pointer hover:bg-slate-50">
              <Calendar className="h-3.5 w-3.5 text-[#6366f1]" />
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  toast.success(`Period changed to ${e.target.value}`);
                }}
                className="appearance-none bg-transparent pr-4 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Last 12 Months">Last 12 Months</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Year to Date">Year to Date</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Refresh Live Data */}
          <button
            type="button"
            onClick={() => {
              refetch();
              refetchOverviewAnalytics();
              refetchRenewals();
              refetchInvoices();
              refetchDocuments();
              refetchAudit();
              refetchSubscriptions();
              refetchTickets();
              toast.success('Refreshed customer data from database');
            }}
            disabled={isFetching || isOverviewAnalyticsFetching}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Refresh from Database"
          >
            <RefreshCw className={cn('h-3.5 w-3.5 text-[#6366f1]', (isFetching || isOverviewAnalyticsFetching) && 'animate-spin')} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Actions Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Actions</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>

            {showActionsMenu && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30 text-xs font-medium text-slate-700">
                <button
                  type="button"
                  onClick={() => router.push(`/customer/master/edit/${customer.id}`)}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 hover:text-[#6366f1] flex items-center gap-2"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Edit Customer Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('Change Plan')}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 hover:text-[#6366f1] flex items-center gap-2"
                >
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  Upgrade / Change Plan
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('Download Statement')}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 hover:text-[#6366f1] flex items-center gap-2"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Download Statement
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => handleAction('Contact Support')}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-red-600 flex items-center gap-2"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  Suspend / Hold
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. CUSTOMER HERO PROFILE CARD + 3 STAT CARDS (ROW 1)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-stretch">
        {/* Main Customer Profile Card (8 Cols) */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-center gap-4">
          {/* Organization Thumbnail / Illustration (Education Campus or Modern Tech Enterprise) */}
          <div className="relative w-full md:w-36 h-32 shrink-0 rounded-xl overflow-hidden border border-slate-200/80 shadow-xs bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50">
            {customer.industryIcon === 'education' ? (
              <svg
                viewBox="0 0 200 160"
                className="w-full h-full object-cover"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Sky */}
                <rect width="200" height="160" fill="#bae6fd" />
                {/* Sun & Clouds */}
                <circle cx="165" cy="30" r="14" fill="#fef08a" />
                <path
                  d="M20 35 Q30 25 45 35 Q55 25 70 35 A10 10 0 0 1 70 45 L20 45 Z"
                  fill="#ffffff"
                  opacity="0.85"
                />
                {/* Trees background */}
                <circle cx="25" cy="95" r="22" fill="#15803d" />
                <circle cx="175" cy="95" r="22" fill="#15803d" />
                <circle cx="15" cy="105" r="18" fill="#166534" />
                <circle cx="185" cy="105" r="18" fill="#166534" />

                {/* Main Brick Building */}
                <rect x="35" y="55" width="130" height="75" rx="3" fill="#b91c1c" />
                <rect x="40" y="60" width="120" height="70" fill="#991b1b" opacity="0.4" />

                {/* Roof Trim & Triangular Pediment */}
                <polygon points="100,28 65,55 135,55" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <rect x="32" y="52" width="136" height="5" fill="#f8fafc" />

                {/* Pediment Clock / Emblem */}
                <circle cx="100" cy="44" r="5" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />

                {/* School Signboard */}
                <rect x="52" y="60" width="96" height="11" rx="2" fill="#ffffff" />
                <text
                  x="100"
                  y="68"
                  fontSize="5.5"
                  fontWeight="bold"
                  fill="#991b1b"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {(customer.name || 'SCHOOL').slice(0, 22).toUpperCase()}
                </text>

                {/* Windows Grid */}
                <g fill="#e0f2fe" stroke="#ffffff" strokeWidth="1">
                  <rect x="46" y="77" width="14" height="14" rx="2" />
                  <rect x="66" y="77" width="14" height="14" rx="2" />
                  <rect x="120" y="77" width="14" height="14" rx="2" />
                  <rect x="140" y="77" width="14" height="14" rx="2" />
                  <rect x="46" y="98" width="14" height="14" rx="2" />
                  <rect x="66" y="98" width="14" height="14" rx="2" />
                  <rect x="120" y="98" width="14" height="14" rx="2" />
                  <rect x="140" y="98" width="14" height="14" rx="2" />
                </g>

                {/* Center Entrance Portico */}
                <rect x="88" y="75" width="24" height="55" fill="#f8fafc" />
                <path
                  d="M93 130 V98 Q100 90 107 98 V130 Z"
                  fill="#475569"
                  stroke="#334155"
                  strokeWidth="1"
                />
                <line x1="100" y1="94" x2="100" y2="130" stroke="#f8fafc" strokeWidth="1" />

                {/* Entrance Steps & Front Lawn */}
                <polygon points="82,130 118,130 126,145 74,145" fill="#cbd5e1" />
                <polygon points="74,145 126,145 140,160 60,160" fill="#94a3b8" />
                <polygon points="0,130 82,130 74,145 60,160 0,160" fill="#22c55e" />
                <polygon points="118,130 200,130 200,160 140,160 126,145" fill="#22c55e" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 200 160"
                className="w-full h-full object-cover"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Modern Tech Enterprise Tower */}
                <defs>
                  <linearGradient id="corpSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e0e7ff" />
                    <stop offset="100%" stopColor="#c7d2fe" />
                  </linearGradient>
                  <linearGradient id="corpGlass" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4338ca" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <rect width="200" height="160" fill="url(#corpSky)" />
                <circle cx="168" cy="28" r="16" fill="#fbcfe8" opacity="0.6" />
                <rect x="25" y="45" width="40" height="100" rx="3" fill="#818cf8" opacity="0.4" />
                <rect x="135" y="35" width="45" height="110" rx="3" fill="#818cf8" opacity="0.4" />
                {/* Main Glass Tower */}
                <rect x="58" y="24" width="84" height="126" rx="4" fill="url(#corpGlass)" />
                {/* Glass Panels Grid */}
                <g stroke="#ffffff" strokeWidth="0.8" opacity="0.35">
                  <line x1="58" y1="44" x2="142" y2="44" />
                  <line x1="58" y1="64" x2="142" y2="64" />
                  <line x1="58" y1="84" x2="142" y2="84" />
                  <line x1="58" y1="104" x2="142" y2="104" />
                  <line x1="58" y1="124" x2="142" y2="124" />
                  <line x1="79" y1="24" x2="79" y2="150" />
                  <line x1="100" y1="24" x2="100" y2="150" />
                  <line x1="121" y1="24" x2="121" y2="150" />
                </g>
                {/* Corporate Header Signboard */}
                <rect x="64" y="30" width="72" height="10" rx="2" fill="#ffffff" opacity="0.95" />
                <text
                  x="100"
                  y="37.5"
                  fontSize="5"
                  fontWeight="bold"
                  fill="#4338ca"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {(customer.name || 'ENTERPRISE').slice(0, 18).toUpperCase()}
                </text>
                {/* Foundation Base */}
                <rect x="0" y="146" width="200" height="14" fill="#312e81" />
              </svg>
            )}
          </div>

          {/* Center Info: Name, Status & Contacts */}
          <div className="flex-1 min-w-0 w-full space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                {customer.name}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                {customer.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <span className="font-semibold text-slate-800">{customer.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <span className="text-slate-600">{customer.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <span className="text-slate-700">{customer.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <span className="text-slate-700">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-slate-700 hover:text-[#6366f1] transition-colors"
                >
                  {customer.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right Meta Column: Since, ID, Plan */}
          <div className="w-full md:w-auto md:min-w-[170px] border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 space-y-3 shrink-0">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Customer Since</div>
              <div className="text-xs md:text-sm font-bold text-slate-900 mt-0.5">
                {customer.customerSince}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Customer ID</div>
              <div className="text-xs md:text-sm font-bold text-slate-900 mt-0.5">
                {customer.customerId}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Plan</div>
              <div className="text-xs md:text-sm font-bold text-slate-900 mt-0.5">
                {customer.plan}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Right Stat Cards (4 Cols) - Real, Non-redundant Business KPIs */}
        <div className="xl:col-span-4 grid grid-cols-3 gap-2.5">
          {/* Card 1: Annual Contract Value (ARR) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col items-center justify-between text-center">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#6366f1] flex items-center justify-center">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Annual ARR</div>
            <div className="text-lg md:text-xl font-extrabold text-slate-900 mt-1 truncate max-w-full">
              ₹{Number(customer.arrValue || 9000000).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Billed Annually</div>
          </div>

          {/* Card 2: Licensed Seats & Plan */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col items-center justify-between text-center">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Licensed Seats</div>
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              {customer.users.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{customer.plan} Plan</div>
          </div>

          {/* Card 3: Contract Renewal & Countdown */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col items-center justify-between text-center">
            <div className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center',
              customer.status === 'Overdue'
                ? 'bg-rose-50 text-rose-600'
                : daysUntilRenewal !== null && daysUntilRenewal <= 30
                ? 'bg-amber-50 text-amber-600'
                : 'bg-emerald-50 text-emerald-600'
            )}>
              <Calendar className="h-5 w-5" />
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Next Renewal</div>
            <div className="text-lg md:text-xl font-extrabold text-slate-900 mt-1">
              {daysUntilRenewal !== null ? `${daysUntilRenewal}d left` : 'Confirmed'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{customer.nextRenewal}</div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. TAB NAVIGATION BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isTabFetching =
            (tab.id === 'billing' && (isRenewalsFetching || isInvoicesFetching)) ||
            (tab.id === 'documents' && isDocumentsFetching) ||
            (tab.id === 'activity' && isAuditFetching) ||
            (tab.id === 'subscriptions' && isSubsFetching) ||
            (tab.id === 'tickets' && isTicketsFetching);

          const badgeCount =
            tab.id === 'billing'
              ? renewalsData.length + invoicesData.length
              : tab.id === 'documents'
              ? documentsData.length
              : tab.id === 'activity'
              ? auditData.length
              : tab.id === 'subscriptions'
              ? customerSubscriptions.length
              : tab.id === 'tickets'
              ? customerTickets.length
              : null;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#6366f1] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#6366f1]'}`} />
              <span>{tab.label}</span>
              {isTabFetching ? (
                <RefreshCw className="h-3 w-3 animate-spin opacity-80" />
              ) : badgeCount !== null && badgeCount > 0 ? (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {badgeCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. MAIN VIEW CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-3.5">
          {/* ──────────────────────────────────────────────────────────
              ROW 1: SUBSCRIBED PRODUCTS, USAGE & ADOPTION, CUSTOMER HEALTH
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* Box 1: Subscribed Products & Add-ons */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                  <Layers className="h-4 w-4 text-[#6366f1]" />
                  <span>Subscribed Products &amp; Add-ons</span>
                </div>

                <div className="space-y-3">
                  {liveSubscribedProducts && liveSubscribedProducts.length > 0 ? (
                    liveSubscribedProducts.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                          {customer.industryIcon === 'education' ? (
                            <GraduationCap className="h-4 w-4 text-[#6366f1]" />
                          ) : (
                            <Laptop className="h-4 w-4 text-[#6366f1]" />
                          )}
                          <span>{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#e0e7ff] text-[#4338ca] text-[11px] font-semibold">
                            {p.edition}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d] text-[11px] font-semibold">
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-b-0">
                      <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                        <Layers className="h-4 w-4 text-[#6366f1]" />
                        <span>{customer.product || 'Standard Plan'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#e0e7ff] text-[#4338ca] text-[11px] font-semibold">
                          {customer.plan || 'Professional'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d] text-[11px] font-semibold">
                          {customer.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Add-ons */}
                  <div className="flex items-start justify-between text-xs py-1.5">
                    <div className="flex items-start gap-2.5">
                      <BarChart3 className="h-4 w-4 text-[#6366f1] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">
                          Add-ons ({liveAddonsList.length})
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {liveAddonsList.join(', ')}
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d] text-[11px] font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Usage & Adoption (Last 30 Days) - Live API */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                <BarChart3 className="h-4 w-4 text-[#6366f1]" />
                <span>Usage &amp; Adoption (Last 30 Days)</span>
              </div>

              <div className="space-y-3.5">
                {/* Metric 1: Active Users */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Users className="h-4 w-4 text-[#6366f1]" />
                      <span>Active Users</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {activeUsersVal} / {activeUsersTotal} ({activeUsersPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6366f1] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, activeUsersPct))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Metric 2: Industry-Adaptive Metric (Student Logins for Education, Daily Logins for IT / Others) */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      {customer.industryIcon === 'education' ? (
                        <>
                          <GraduationCap className="h-4 w-4 text-[#6366f1]" />
                          <span>Student Logins</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 text-[#6366f1]" />
                          <span>Daily Active Logins</span>
                        </>
                      )}
                    </div>
                    <span className="font-bold text-slate-900">
                      {customer.industryIcon === 'education'
                        ? `${(customer.studentLogins || 0).toLocaleString()} / ${(customer.students || 0).toLocaleString()} (${customer.students ? Math.round(((customer.studentLogins || 0) / customer.students) * 100) : 0}%)`
                        : `${dailyLoginsVal} / ${dailyLoginsTotal} (${dailyLoginsPct}%)`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6366f1] transition-all duration-500"
                      style={{
                        width: `${
                          customer.industryIcon === 'education'
                            ? (customer.students ? Math.min(100, Math.round(((customer.studentLogins || 0) / customer.students) * 100)) : 0)
                            : Math.min(100, Math.max(0, dailyLoginsPct))
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Metric 3: Key Modules Used */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Layers className="h-4 w-4 text-[#6366f1]" />
                      <span>Key Modules Used</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {modulesUsedVal} / {modulesUsedTotal} ({modulesUsedPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6366f1] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, modulesUsedPct))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Customer Health - Live API */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                <HeartPulse className="h-4 w-4 text-[#6366f1]" />
                <span>Customer Health</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Donut Chart Gauge */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-100"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={healthScore >= 80 ? '#22c55e' : healthScore < 60 ? '#ef4444' : '#f59e0b'}
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-slate-900">{healthScore}%</span>
                    <span
                      className={cn(
                        'text-[11px] font-semibold',
                        healthScore >= 80 ? 'text-emerald-600' : healthScore < 60 ? 'text-rose-600' : 'text-amber-600'
                      )}
                    >
                      {healthStatus}
                    </span>
                  </div>
                </div>

                {/* Health Criteria Checklist */}
                <div className="space-y-2 text-xs font-semibold text-slate-800">
                  {healthChecklist.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded text-white shrink-0',
                          factor.passed ? 'bg-emerald-500' : 'bg-slate-300'
                        )}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      <span className={factor.passed ? 'text-slate-800' : 'text-slate-400'}>
                        {factor.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              ROW 2: USAGE TREND & SUBSCRIPTION/RENEWAL (LIVE API)
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left: Usage Trend – Active Users (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Layers className="h-4 w-4 text-[#6366f1]" />
                  <span>Usage Trend – Active Users</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600">
                  {overviewAnalytics?.usage_trend?.growth_label || '↑ +18% vs. previous period'}
                </div>
              </div>

              {/* Area Line Chart */}
              <div className="h-44 w-full relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 150"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline Grids & Labels from Live API Ceiling */}
                  {gridSteps.map((grid) => (
                    <g key={grid.val}>
                      <line
                        x1="35"
                        y1={grid.y}
                        x2="600"
                        y2={grid.y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                      <text
                        x="5"
                        y={grid.y + 3}
                        fontSize="9"
                        fill="#94a3b8"
                        fontFamily="sans-serif"
                      >
                        {grid.val}
                      </text>
                    </g>
                  ))}

                  {/* Live Dynamic Area Fill */}
                  <polygon
                    points={polygonPoints}
                    fill="url(#usageGradient)"
                  />

                  {/* Live Dynamic Smooth Polyline */}
                  <polyline
                    points={polylinePoints}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Live Dynamic Dots on points with Tooltip */}
                  {chartPoints.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#6366f1"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <title>{`${p.month}: ${p.active_users} active users`}</title>
                    </g>
                  ))}
                </svg>

                {/* X Axis Months from Live API */}
                <div className="flex justify-between pl-9 pr-1 text-[11px] font-medium text-slate-500 mt-2">
                  {chartPoints.map((p) => (
                    <span key={p.month}>{p.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Subscription & Renewal (4 Cols) - Live API */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                  <Calendar className="h-4 w-4 text-[#6366f1]" />
                  <span>Subscription &amp; Renewal</span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-medium w-28">Current Plan</span>
                      <span className="font-bold text-slate-900">{currentPlanDisplay}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-medium w-28">Annual Fee (ARR)</span>
                      <span className="font-extrabold text-slate-900">
                        {annualArrDisplay}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-medium w-28">Next Renewal</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900">{nextRenewalDisplay}</span>
                        {(subSummary?.days_left ?? daysUntilRenewal) !== null && (
                          <span
                            className={cn(
                              'text-[10px] font-semibold px-2 py-0.5 rounded',
                              (subSummary?.days_left ?? daysUntilRenewal ?? 0) <= 0
                                ? 'text-rose-800 bg-rose-100'
                                : (subSummary?.days_left ?? daysUntilRenewal ?? 0) <= 30
                                ? 'text-amber-800 bg-amber-100'
                                : 'text-emerald-800 bg-emerald-100'
                            )}
                          >
                            {(subSummary?.days_left ?? daysUntilRenewal ?? 0) <= 0
                              ? 'Expired'
                              : `(${subSummary?.days_left ?? daysUntilRenewal} days left)`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Renewal Likely Badge */}
                  <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex flex-col items-center text-center shrink-0 min-w-[95px]">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                      <RotateCw className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 leading-tight">
                      {renewalLikelihoodDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              ROW 3: RECENT ACTIVITY & QUICK ACTIONS
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left: Recent Activity (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                <Clock className="h-4 w-4 text-[#6366f1]" />
                <span>Recent Activity</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                      <th className="pb-2 font-bold text-slate-900">Date &amp; Time</th>
                      <th className="pb-2 font-bold text-slate-900">Activity</th>
                      <th className="pb-2 font-bold text-slate-900">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {auditData.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-slate-400 text-xs font-medium">
                          No recent activity recorded for this customer
                        </td>
                      </tr>
                    ) : (
                      auditData.slice(0, 4).map((audit: any, idx: number) => {
                        const userName =
                          typeof audit.Created_By === 'object' && audit.Created_By
                            ? audit.Created_By.username || audit.Created_By.email || 'Admin'
                            : String(audit.Created_By || 'Admin');
                        const timeStr = audit.Created_Date
                          ? String(audit.Created_Date).replace('T', ' ').slice(0, 16)
                          : '—';
                        return (
                          <tr key={audit.id || idx}>
                            <td className="py-2.5 text-slate-700 whitespace-nowrap">{timeStr}</td>
                            <td className="py-2.5 text-slate-900">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-[#6366f1]" />
                                <span>{audit.Description || `${audit.Action} event on customer account`}</span>
                              </div>
                            </td>
                            <td className="py-2.5 text-slate-700">{userName}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Quick Actions (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                <Zap className="h-4 w-4 text-[#6366f1]" />
                <span>Quick Actions</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => router.push('/customer/usage')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Users className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Manage Users</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/customer/subscription-management')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Layers className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Change Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/customer/addon-subscriptions')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <ShoppingCart className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Add/Manage Add-ons</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.info('Support ticket creation modal opened')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Ticket className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Raise Support Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.success('Report download initiated')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <FileText className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Download Reports</span>
                </button>

                <button
                  type="button"
                  onClick={() => (window.location.href = `mailto:${customer.email}`)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Mail className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Contact Customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          5. OTHER TABS (SUBSCRIPTIONS, USAGE, TICKETS, BILLING, DOCUMENTS, AUDIT)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#6366f1]" />
              Active Subscriptions &amp; Module Entitlements
            </h3>
            <button
              type="button"
              onClick={() => router.push('/customer/subscription-management')}
              className="text-xs font-semibold text-[#6366f1] hover:underline"
            >
              Manage in Subscription Portal &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerSubscriptions.length > 0 ? (
              customerSubscriptions.map((sub: any, idx: number) => (
                <div
                  key={sub.id || idx}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      {sub.Product_Name || sub.Subscription_Name || customer.product}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                        String(sub.status || '').toLowerCase() === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {sub.status || 'Active'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Plan: <span className="font-semibold">{sub.Plan_Name || customer.plan}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-4">
                    <span>Start: {sub.start_date ? String(sub.start_date).slice(0, 10) : customer.startDate}</span>
                    <span>End: {sub.end_date ? String(sub.end_date).slice(0, 10) : customer.nextRenewal}</span>
                  </div>
                </div>
              ))
            ) : (
              customer.subscribedProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{p.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">Edition: {p.edition}</div>
                  <div className="text-xs text-slate-500">
                    Includes full enterprise modules, cloud storage, user licenses, and SLA support.
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Enabled Add-ons
            </h4>
            <div className="flex flex-wrap gap-2">
              {customer.addonsList.map((addon, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-purple-50 text-[#6366f1] border border-purple-100 text-xs font-semibold"
                >
                  + {addon}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-[#6366f1]" />
            Detailed System Telemetry &amp; Adoption
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Licensed User Seats</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{customer.users} Seats</div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">
                {customer.status === 'Active' ? '100% Provisioned' : 'Action Required'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Active Tenant Instances</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{customer.tenantsCount} Instance</div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">Operational</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Account Classification</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{customer.industry}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">SLA: {customer.slaTier}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Headphones className="h-5 w-5 text-[#6366f1]" />
              Support Tickets &amp; SLA Performance
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {customerTickets.filter((t: any) => String(t.Status || '').toLowerCase() !== 'resolved').length} Open Tickets
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-2">Ticket ID</th>
                  <th className="pb-2">Subject</th>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-medium">
                      No support tickets found for {customer.name}
                    </td>
                  </tr>
                ) : (
                  customerTickets.map((t: any, idx: number) => (
                    <tr key={t.id || idx}>
                      <td className="py-2.5 font-semibold text-slate-800">{t.Ticket_Id || `TICK-${t.id || idx + 1}`}</td>
                      <td className="py-2.5 text-slate-700">{t.Ticket_Title || t.Subject || t.Details || 'Support Request'}</td>
                      <td className="py-2.5 text-amber-600 font-medium">{t.Priority || 'Normal'}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                          {t.Status || 'Open'}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-500">{t.Created_Date ? String(t.Created_Date).slice(0, 10) : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#6366f1]" />
                Customer Renewals &amp; Billing Invoices
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#6366f1] border border-purple-100">
                  {renewalsData.length} Contract{renewalsData.length === 1 ? '' : 's'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {invoicesData.length} Invoice{invoicesData.length === 1 ? '' : 's'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Live tracking of customer renewal dates, expiry schedules, ARR pipelines, and billing invoices
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBillingSubView('schedule')}
                  className={cn(
                    'px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5',
                    billingSubView === 'schedule'
                      ? 'bg-white text-[#6366f1] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Renewal Schedule ({renewalsData.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingSubView('invoices')}
                  className={cn(
                    'px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5',
                    billingSubView === 'invoices'
                      ? 'bg-white text-[#6366f1] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Invoices &amp; Billing ({invoicesData.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  refetchRenewals();
                  refetchInvoices();
                  toast.success('Refreshed renewal schedule & invoices from API');
                }}
                disabled={isRenewalsFetching || isInvoicesFetching}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Refresh Renewal &amp; Billing API"
              >
                <RefreshCw className={cn('h-3.5 w-3.5 text-[#6366f1]', (isRenewalsFetching || isInvoicesFetching) && 'animate-spin')} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Metric summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Active Contracts</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {renewalsData.length > 0 ? `${renewalsData.length} accounts` : '1 account'}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
              <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Expiring Soon (30 Days)</div>
              <div className="text-xl font-bold text-amber-900 mt-1">
                {renewalsData.filter((r: any) => String(r.Renewal_Status || r.status || '').toLowerCase() === 'expiring').length} renewal required
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70">
              <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">Overdue Renewals</div>
              <div className="text-xl font-bold text-rose-900 mt-1">
                {renewalsData.filter((r: any) => String(r.Renewal_Status || r.status || '').toLowerCase() === 'overdue').length} action required
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/70">
              <div className="text-[11px] font-semibold text-[#6366f1] uppercase tracking-wider">Renewal Pipeline (ARR)</div>
              <div className="text-xl font-bold text-[#6366f1] mt-1">
                ₹{customer.arr}
              </div>
            </div>
          </div>

          {/* Subview 1: Renewal Schedule */}
          {billingSubView === 'schedule' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Contract Renewal Schedule ({renewalsData.length})
                </h4>
              </div>
              <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Renewal ID</th>
                      <th className="py-2.5 px-3">Customer Account</th>
                      <th className="py-2.5 px-3">Product &amp; Plan</th>
                      <th className="py-2.5 px-3">Renewal Date</th>
                      <th className="py-2.5 px-3">Annual Value (ARR)</th>
                      <th className="py-2.5 px-3">Renewal Status</th>
                      <th className="py-2.5 px-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isRenewalsLoading || isRenewalsFetching ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 text-xs font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#6366f1]" />
                            <span>Loading live renewal schedule from API...</span>
                          </div>
                        </td>
                      </tr>
                    ) : renewalsData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-400 font-medium">
                          No renewal schedule found for this customer account
                        </td>
                      </tr>
                    ) : (
                      renewalsData.map((item: any, idx: number) => {
                        const renewalId = item.Renewal_Id || `REN-${item.id}`;
                        const custName = item.Customer_Name || customer.name;
                        const prodPlan = `${item.Producttype || customer.product} - ${item.Plan_Name || customer.plan}`;
                        const dateStr = item.RenewalDate || customer.nextRenewal;
                        const amt = item.RenewalAmount || item.PlanNetAmount || item.PlangrossAmount || customer.arr;
                        const st = String(item.Renewal_Status || item.status || customer.status).toUpperCase();
                        const paySt = item.Payment_Status || (st === 'ACTIVE' ? 'Paid' : 'Pending');
                        return (
                          <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{renewalId}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{custName}</td>
                            <td className="py-2.5 px-3 text-slate-700">{prodPlan}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-700">{dateStr}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">₹{typeof amt === 'number' ? amt.toLocaleString('en-IN') : amt}</td>
                            <td className="py-2.5 px-3">
                              <span className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                                st === 'ACTIVE' && 'bg-emerald-100 text-emerald-800',
                                st === 'OVERDUE' && 'bg-rose-100 text-rose-800',
                                st === 'EXPIRING' && 'bg-amber-100 text-amber-800'
                              )}>
                                {st}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-semibold',
                                paySt.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              )}>
                                {paySt}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subview 2: Invoices */}
          {billingSubView === 'invoices' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Billing Invoices ({invoicesData.length})
                </h4>
              </div>
              <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Invoice ID</th>
                      <th className="py-2.5 px-3">Description / Plan</th>
                      <th className="py-2.5 px-3">Invoice Date</th>
                      <th className="py-2.5 px-3">Base Amount</th>
                      <th className="py-2.5 px-3">Tax Amount</th>
                      <th className="py-2.5 px-3">Net Amount</th>
                      <th className="py-2.5 px-3">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isInvoicesLoading || isInvoicesFetching ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#6366f1]" />
                            <span>Loading live invoices from API...</span>
                          </div>
                        </td>
                      </tr>
                    ) : invoicesData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-400 font-medium">
                          No billing invoices found for this account
                        </td>
                      </tr>
                    ) : (
                      invoicesData.map((inv: any, idx: number) => {
                        const invId = inv.Invoice_Id || inv.Invoice_Number || inv.id || `INV-${idx + 1}`;
                        const baseAmt = inv.InvoiceAmount || inv.Amount || customer.arr;
                        const taxAmt = inv.TaxAmount || 0;
                        const netAmt = inv.NetAmount || baseAmt;
                        const dateStr = inv.Invoice_Date || inv.InvoiceDate || inv.Created_Date ? String(inv.Invoice_Date || inv.InvoiceDate || inv.Created_Date).slice(0, 10) : '—';
                        const desc = inv.InvoiceFor || inv.Subscription_Name || customer.plan;
                        const payStatus = inv.Payment_Status || (inv.Is_Archived ? 'PAID' : 'PENDING');
                        return (
                          <tr key={inv.id || idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{invId}</td>
                            <td className="py-2.5 px-3 text-slate-700">{desc}</td>
                            <td className="py-2.5 px-3 text-slate-500">{dateStr}</td>
                            <td className="py-2.5 px-3 text-slate-700">₹{Number(baseAmt).toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3 text-slate-500">₹{Number(taxAmt).toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">₹{Number(netAmt).toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-[11px] font-semibold',
                                  payStatus.toLowerCase().includes('paid')
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : payStatus.toLowerCase().includes('overdue')
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                )}
                              >
                                {payStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#6366f1]" />
                Customer Documents &amp; Contracts ({documentsData.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized repository for Master Service Agreements (MSA), NDAs, SLA contracts, and compliance certificates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  refetchDocuments();
                  toast.success('Refreshed customer documents from API');
                }}
                disabled={isDocumentsFetching}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Refresh Documents API"
              >
                <RefreshCw className={cn('h-3.5 w-3.5 text-[#6366f1]', isDocumentsFetching && 'animate-spin')} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/customer/documents-contracts')}
                className="text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#5046e5] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Upload / Documents Portal &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Documents</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{documentsData.length}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70">
              <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Contracts &amp; MSAs</div>
              <div className="text-xl font-bold text-blue-900 mt-1">
                {documentsData.filter((d: any) => String(d.File_Type || '').toLowerCase().includes('contract') || String(d.FileName || '').toLowerCase().includes('msa')).length || (documentsData.length > 0 ? 1 : 0)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
              <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">NDAs &amp; Compliance</div>
              <div className="text-xl font-bold text-emerald-900 mt-1">
                {documentsData.filter((d: any) => String(d.File_Type || '').toLowerCase().includes('nda') || String(d.File_Type || '').toLowerCase().includes('compliance')).length || (documentsData.length > 0 ? 1 : 0)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
              <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Invoices &amp; Statements</div>
              <div className="text-xl font-bold text-amber-900 mt-1">
                {documentsData.filter((d: any) => String(d.File_Type || '').toLowerCase().includes('invoice')).length}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {isDocumentsLoading || isDocumentsFetching ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#6366f1]" />
                <span>Loading live documents from database...</span>
              </div>
            ) : documentsData.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
                No contracts or documents attached to this customer account yet.
              </div>
            ) : (
              documentsData.map((doc: any, idx: number) => {
                const fileName = doc.FileName || doc.Document_Name || `Document-${idx + 1}.pdf`;
                const fileSize = doc.File_Size || '—';
                const createdDate = doc.Created_Date ? String(doc.Created_Date).slice(0, 10) : '—';
                const fileUrl = doc.File || '#';
                const fileType = doc.File_Type || 'Contract';
                return (
                  <div
                    key={doc.id || idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 hover:bg-slate-50 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-50 text-[#6366f1] flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span>{fileName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-600">
                            {fileType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Uploaded on {createdDate} • {fileSize}
                        </div>
                      </div>
                    </div>
                    {fileUrl && fileUrl !== '#' ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#6366f1] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">On File</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="h-5 w-5 text-[#6366f1]" />
                Customer Activity History &amp; Audit Log ({auditData.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full chronological audit trail of all updates, status changes, and administrative actions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  refetchAudit();
                  toast.success('Refreshed audit history from API');
                }}
                disabled={isAuditFetching}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Refresh Activity API"
              >
                <RefreshCw className={cn('h-3.5 w-3.5 text-[#6366f1]', isAuditFetching && 'animate-spin')} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {isAuditLoading || isAuditFetching ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#6366f1]" />
                <span>Loading live activity history from database...</span>
              </div>
            ) : auditData.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
                No activity history found for this customer record.
              </div>
            ) : (
              auditData.map((item: any, idx: number) => {
                const userName =
                  typeof item.Created_By === 'object' && item.Created_By
                    ? item.Created_By.username || item.Created_By.email || 'Admin'
                    : String(item.Created_By || 'Admin');
                const timeStr = item.Created_Date
                  ? String(item.Created_Date).replace('T', ' ').slice(0, 19)
                  : '—';
                const action = String(item.Action || 'ACTION').toUpperCase();
                return (
                  <div
                    key={item.id || idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors"
                  >
                    <Clock className="h-4 w-4 text-[#6366f1] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          {item.Description || `${item.Action} on customer account`}
                        </span>
                        <span className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                          action.includes('CREATE') && 'bg-emerald-100 text-emerald-800',
                          action.includes('UPDATE') && 'bg-blue-100 text-blue-800',
                          action.includes('DELETE') && 'bg-rose-100 text-rose-800',
                          !action.includes('CREATE') && !action.includes('UPDATE') && !action.includes('DELETE') && 'bg-purple-100 text-[#6366f1]'
                        )}>
                          {action}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {timeStr} • by <span className="font-semibold text-slate-700">{userName}</span>
                        {item.IP_Address ? ` • IP: ${item.IP_Address}` : ''}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
