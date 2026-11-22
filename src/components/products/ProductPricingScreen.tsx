'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag,
  CheckCircle2,
  Clock,
  PauseCircle,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  MoreVertical,
  Layers,
  Check,
  X,
  Info,
  Calendar,
  Globe,
  Trash2,
  Copy,
  FileDown,
  Eye,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Percent,
  Save,
  FileText,
  Sparkles,
  TrendingUp,
  CheckSquare,
  Square,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export interface TierItem {
  id: string;
  name: string;
  price: string;
  userLimit: string;
  storage: string;
  features: string;
}

export interface PricingRule {
  id: string;
  pricingId: string;
  product: string;
  edition: string;
  plan: string;
  country: string;
  countryCode: string;
  currency: string;
  price: string;
  priceNumeric: number;
  billingCycle: 'Monthly' | 'Annual' | 'Quarterly';
  effectiveFrom: string;
  effectiveTo: string;
  taxTreatment: string;
  licenseUnit: string;
  minQuantity: number;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Draft';
  tiers: TierItem[];
  applicableSegments: string[];
  allowDiscounts: boolean;
  allowCustomization: boolean;
  hsnCode: string;
  taxRate: string;
  invoicingNotes: string;
}

const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'prc-1',
    pricingId: 'PRC-000782',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Standard',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR (₹)',
    price: '₹4,999',
    priceNumeric: 4999,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
    tiers: [
      { id: 't1', name: 'Basic', price: '₹1,499', userLimit: 'Up to 5', storage: '10 GB', features: 'Core CRM' },
      { id: 't2', name: 'Pro', price: '₹4,999', userLimit: 'Up to 25', storage: '50 GB', features: 'Advanced Analytics' },
      { id: 't3', name: 'Enterprise', price: '₹12,499', userLimit: 'Up to 100', storage: '250 GB', features: 'Custom SLA & APIs' },
    ],
    applicableSegments: ['Small Business', 'Mid Market', 'Education'],
    allowDiscounts: true,
    allowCustomization: true,
    hsnCode: '998314 - SaaS Services',
    taxRate: '18% GST',
    invoicingNotes: 'Prices are subject to standard 18% GST for Indian domestic entities.',
  },
  {
    id: 'prc-2',
    pricingId: 'PRC-000783',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Standard',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR (₹)',
    price: '₹49,999',
    priceNumeric: 49999,
    billingCycle: 'Annual',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
    tiers: [
      { id: 't1', name: 'Annual Pro', price: '₹49,999', userLimit: 'Up to 25', storage: '60 GB', features: '2 Months Free' },
      { id: 't2', name: 'Annual Enterprise', price: '₹1,24,999', userLimit: 'Up to 100', storage: '300 GB', features: 'Priority Support' },
    ],
    applicableSegments: ['Mid Market', 'Enterprise'],
    allowDiscounts: true,
    allowCustomization: true,
    hsnCode: '998314 - SaaS Services',
    taxRate: '18% GST',
    invoicingNotes: 'Includes 17% annual discount commitment.',
  },
  {
    id: 'prc-3',
    pricingId: 'PRC-000784',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Standard',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD ($)',
    price: '$79',
    priceNumeric: 79,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
    tiers: [
      { id: 't1', name: 'US Starter', price: '$29', userLimit: 'Up to 5', storage: '10 GB', features: 'Basic CRM' },
      { id: 't2', name: 'US Growth', price: '$79', userLimit: 'Up to 25', storage: '50 GB', features: 'Full CRM Suite' },
    ],
    applicableSegments: ['SMB', 'Mid Market'],
    allowDiscounts: true,
    allowCustomization: false,
    hsnCode: 'US-SaaS-998',
    taxRate: 'State Sales Tax (Where Applicable)',
    invoicingNotes: 'Standard US export invoicing terms.',
  },
  {
    id: 'prc-4',
    pricingId: 'PRC-000785',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Standard',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD ($)',
    price: '$799',
    priceNumeric: 799,
    billingCycle: 'Annual',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
    tiers: [
      { id: 't1', name: 'US Annual Pro', price: '$799', userLimit: 'Up to 25', storage: '100 GB', features: 'Annual Discount Applied' },
    ],
    applicableSegments: ['SMB', 'Mid Market'],
    allowDiscounts: true,
    allowCustomization: false,
    hsnCode: 'US-SaaS-998',
    taxRate: 'State Sales Tax',
    invoicingNotes: 'Annual upfront payment.',
  },
  {
    id: 'prc-5',
    pricingId: 'PRC-000786',
    product: 'Pegatto Education',
    edition: 'Professional',
    plan: 'Premium',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR (₹)',
    price: '₹9,999',
    priceNumeric: 9999,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Feb 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per School',
    minQuantity: 1,
    status: 'Active',
    tiers: [
      { id: 't1', name: 'Single Campus', price: '₹9,999', userLimit: 'Up to 1,500 students', storage: '100 GB', features: 'Academics & Fee Mgmt' },
      { id: 't2', name: 'Multi Campus', price: '₹24,999', userLimit: 'Up to 5,000 students', storage: '500 GB', features: 'Multi-Branch Analytics' },
    ],
    applicableSegments: ['K-12 Schools', 'Higher Education', 'Coaching Centers'],
    allowDiscounts: true,
    allowCustomization: true,
    hsnCode: '998314 - SaaS Services',
    taxRate: '18% GST',
    invoicingNotes: 'Educational institution discount structure.',
  },
  {
    id: 'prc-6',
    pricingId: 'PRC-000787',
    product: 'Pegatto People (HRMS)',
    edition: 'Standard',
    plan: 'Premium',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD ($)',
    price: '$149',
    priceNumeric: 149,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
    tiers: [
      { id: 't1', name: 'HR Essentials', price: '$149', userLimit: 'Up to 50 employees', storage: '20 GB', features: 'Payroll & Attendance' },
    ],
    applicableSegments: ['SMB', 'Mid Market'],
    allowDiscounts: true,
    allowCustomization: false,
    hsnCode: 'US-HR-SaaS',
    taxRate: 'Exempt',
    invoicingNotes: 'Monthly subscription for international entities.',
  },
  {
    id: 'prc-7',
    pricingId: 'PRC-000788',
    product: 'Pegatto IT',
    edition: 'Enterprise',
    plan: 'Enterprise',
    country: 'Global',
    countryCode: 'GL',
    currency: 'USD ($)',
    price: '$299',
    priceNumeric: 299,
    billingCycle: 'Monthly',
    effectiveFrom: '15 Mar 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Scheduled',
    tiers: [
      { id: 't1', name: 'IT Ops', price: '$299', userLimit: 'Up to 200 nodes', storage: '1 TB', features: 'Incident & Asset Mgmt' },
    ],
    applicableSegments: ['Global Enterprise', 'MSP Partners'],
    allowDiscounts: true,
    allowCustomization: true,
    hsnCode: 'GL-IT-9901',
    taxRate: 'Reverse Charge Mechanism',
    invoicingNotes: 'Scheduled rate revision effective mid Q1 2026.',
  },
  {
    id: 'prc-8',
    pricingId: 'PRC-000789',
    product: 'Pegatto Retail',
    edition: 'Professional',
    plan: 'Enterprise',
    country: 'Global',
    countryCode: 'GL',
    currency: 'USD ($)',
    price: '$2,999',
    priceNumeric: 2999,
    billingCycle: 'Annual',
    effectiveFrom: '01 Jan 2025',
    effectiveTo: '31 Dec 2025',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Chain',
    minQuantity: 1,
    status: 'Expired',
    tiers: [
      { id: 't1', name: 'Retail Legacy', price: '$2,999', userLimit: 'Up to 10 Outlets', storage: '500 GB', features: 'POS Sync & Inventory' },
    ],
    applicableSegments: ['Retail Chains'],
    allowDiscounts: false,
    allowCustomization: false,
    hsnCode: 'GL-RET-01',
    taxRate: 'Standard',
    invoicingNotes: 'Historical 2025 annual rate contract.',
  },
];

export interface ProductPricingScreenProps {
  initialMode?: 'view' | 'edit' | 'create';
  initialPricingId?: string;
}

export function ProductPricingScreen({
  initialMode = 'view',
  initialPricingId,
}: ProductPricingScreenProps = {}) {
  const router = useRouter();

  // Top page navigation tabs: 'rules' | 'matrix' | 'bulk' | 'history'
  const [activeTab, setActiveTab] = useState<'rules' | 'matrix' | 'bulk' | 'history'>('rules');

  // Master Pricing Rules State
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);

  // Selected Rule ID (for right panel inspection / edit)
  const [selectedRuleId, setSelectedRuleId] = useState<string>(() => {
    if (initialPricingId) {
      const found = INITIAL_PRICING_RULES.find((r) => r.id === initialPricingId || r.pricingId === initialPricingId);
      if (found) return found.id;
    }
    return 'prc-1';
  });

  // Multi-select row IDs for bulk actions
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['prc-1']);

  // Filters State
  const [filterProduct, setFilterProduct] = useState('All');
  const [filterEdition, setFilterEdition] = useState('All');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterCountry, setFilterCountry] = useState('All Countries');
  const [filterCurrency, setFilterCurrency] = useState('All Currencies');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Right Panel State
  // Mode: 'view' (overview) | 'edit' (editing existing) | 'create' (creating brand new)
  const [panelMode, setPanelMode] = useState<'view' | 'edit' | 'create'>(initialMode);
  // Right panel subtabs: 'overview' | 'details' | 'tiers' | 'applicability' | 'taxes'
  const [rightSubTab, setRightSubTab] = useState<'overview' | 'details' | 'tiers' | 'applicability' | 'taxes'>(
    initialMode === 'create' ? 'details' : 'overview'
  );

  // Form State in Right Panel
  const [formData, setFormData] = useState<PricingRule>(() => {
    if (initialMode === 'create') {
      const newId = `prc-${Date.now()}`;
      const newPricingId = `PRC-00${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        id: newId,
        pricingId: newPricingId,
        product: 'Pegatto CRM',
        edition: 'Professional',
        plan: 'Standard',
        country: 'India',
        countryCode: 'IN',
        currency: 'INR (₹)',
        price: '₹5,999',
        priceNumeric: 5999,
        billingCycle: 'Monthly',
        effectiveFrom: '01 Mar 2026',
        effectiveTo: '—',
        taxTreatment: 'Exclusive of Tax',
        licenseUnit: 'Per Tenant',
        minQuantity: 1,
        status: 'Draft',
        tiers: [
          { id: `t-${Date.now()}-1`, name: 'Starter', price: '₹1,999', userLimit: 'Up to 5', storage: '10 GB', features: 'Essential CRM' },
          { id: `t-${Date.now()}-2`, name: 'Pro', price: '₹5,999', userLimit: 'Up to 25', storage: '50 GB', features: 'Automation & Reports' },
        ],
        applicableSegments: ['Small Business', 'Mid Market'],
        allowDiscounts: true,
        allowCustomization: true,
        hsnCode: '998314 - SaaS Services',
        taxRate: '18% GST',
        invoicingNotes: 'Standard pricing terms apply.',
      };
    }
    if (initialPricingId) {
      const found = INITIAL_PRICING_RULES.find((r) => r.id === initialPricingId || r.pricingId === initialPricingId);
      if (found) return found;
    }
    return INITIAL_PRICING_RULES[0];
  });

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Future Schedule Dialog
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2026-06-01');
  const [newProposedPrice, setNewProposedPrice] = useState('₹5,499');

  // Active Selected Rule
  const selectedRule = useMemo(() => {
    return pricingRules.find((r) => r.id === selectedRuleId) || pricingRules[0];
  }, [pricingRules, selectedRuleId]);

  // Keep form data synced when switching selected row (if in view mode)
  const handleSelectRow = (rule: PricingRule) => {
    setSelectedRuleId(rule.id);
    if (panelMode === 'create') {
      setPanelMode('view');
      setRightSubTab('overview');
      setFormData({ ...rule });
    } else if (panelMode === 'edit') {
      setFormData({ ...rule });
    } else {
      setFormData({ ...rule });
    }
  };

  // Switch to Create Mode in Right Panel
  const handleStartCreate = () => {
    const newId = `prc-${Date.now()}`;
    const newPricingId = `PRC-00${Math.floor(1000 + Math.random() * 9000)}`;
    const freshRule: PricingRule = {
      id: newId,
      pricingId: newPricingId,
      product: 'Pegatto CRM',
      edition: 'Professional',
      plan: 'Standard',
      country: 'India',
      countryCode: 'IN',
      currency: 'INR (₹)',
      price: '₹5,999',
      priceNumeric: 5999,
      billingCycle: 'Monthly',
      effectiveFrom: '01 Mar 2026',
      effectiveTo: '—',
      taxTreatment: 'Exclusive of Tax',
      licenseUnit: 'Per Tenant',
      minQuantity: 1,
      status: 'Draft',
      tiers: [
        { id: `t-${Date.now()}-1`, name: 'Starter', price: '₹1,999', userLimit: 'Up to 5', storage: '10 GB', features: 'Essential CRM' },
        { id: `t-${Date.now()}-2`, name: 'Pro', price: '₹5,999', userLimit: 'Up to 25', storage: '50 GB', features: 'Automation & Reports' },
      ],
      applicableSegments: ['Small Business', 'Mid Market'],
      allowDiscounts: true,
      allowCustomization: true,
      hsnCode: '998314 - SaaS Services',
      taxRate: '18% GST',
      invoicingNotes: 'Standard pricing terms apply.',
    };
    setFormData(freshRule);
    setPanelMode('create');
    setRightSubTab('details');
  };

  // Switch to Edit Mode in Right Panel
  const handleStartEdit = (rule?: PricingRule) => {
    const target = rule || selectedRule;
    if (target) {
      setSelectedRuleId(target.id);
      setFormData({ ...target });
      setPanelMode('edit');
      setRightSubTab('details');
      toast.info(`Editing ${target.pricingId} in form panel`);
    }
  };

  // Save changes from Right Panel form
  const handleSaveForm = (saveAsStatus: 'Active' | 'Draft' = 'Active') => {
    const finalPricingId = formData.pricingId?.trim() || `PRC-00${Math.floor(1000 + Math.random() * 9000)}`;
    const finalProduct = formData.product?.trim() || 'Pegatto CRM';
    const finalPrice = formData.price?.trim() || '₹4,999';

    const updatedRule: PricingRule = {
      ...formData,
      pricingId: finalPricingId,
      product: finalProduct,
      price: finalPrice,
      status: panelMode === 'create' ? saveAsStatus : formData.status === 'Draft' ? saveAsStatus : formData.status,
    };

    if (panelMode === 'create') {
      setPricingRules((prev) => [updatedRule, ...prev]);
      setSelectedRuleId(updatedRule.id);
      setFormData(updatedRule);
      setPanelMode('view');
      setRightSubTab('overview');
      toast.success(`Pricing rule ${updatedRule.pricingId} created successfully!`);
    } else {
      setPricingRules((prev) =>
        prev.map((r) => (r.id === updatedRule.id ? updatedRule : r))
      );
      setSelectedRuleId(updatedRule.id);
      setFormData(updatedRule);
      setPanelMode('view');
      setRightSubTab('overview');
      toast.success(`Pricing rule ${updatedRule.pricingId} updated successfully!`);
    }
  };

  // Cancel edit / create mode
  const handleCancelForm = () => {
    setPanelMode('view');
    setRightSubTab('overview');
    if (selectedRule) {
      setFormData({ ...selectedRule });
    }
    toast.info('Returned to Pricing Overview');
  };

  // Filtered pricing rules
  const filteredRules = useMemo(() => {
    return pricingRules.filter((r) => {
      if (filterProduct !== 'All' && r.product !== filterProduct) return false;
      if (filterEdition !== 'All' && r.edition !== filterEdition) return false;
      if (filterPlan !== 'All Plans' && r.plan !== filterPlan) return false;
      if (filterCountry !== 'All Countries' && r.country !== filterCountry) return false;
      if (filterCurrency !== 'All Currencies' && !r.currency.includes(filterCurrency)) return false;
      if (filterStatus !== 'All' && r.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.product.toLowerCase().includes(q) ||
          r.edition.toLowerCase().includes(q) ||
          r.plan.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.pricingId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pricingRules, filterProduct, filterEdition, filterPlan, filterCountry, filterCurrency, filterStatus, searchQuery]);

  // Paginated list
  const paginatedRules = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRules.slice(start, start + rowsPerPage);
  }, [filteredRules, currentPage, rowsPerPage]);

  // Select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredRules.map((r) => r.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  // Toggle single row checkbox
  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Pricing ID',
      'Product',
      'Edition',
      'Plan',
      'Country',
      'Currency',
      'Price',
      'Billing Cycle',
      'Effective From',
      'Status',
    ];
    const rows = filteredRules.map((r) => [
      r.pricingId,
      r.product,
      r.edition,
      r.plan,
      r.country,
      r.currency,
      r.price,
      r.billingCycle,
      r.effectiveFrom,
      r.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Product_Pricing_Rules_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Pricing rules exported to CSV');
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilterProduct('All');
    setFilterEdition('All');
    setFilterPlan('All Plans');
    setFilterCountry('All Countries');
    setFilterCurrency('All Currencies');
    setFilterStatus('All');
    setSearchQuery('');
    setCurrentPage(1);
    toast.info('Filters reset to default');
  };

  // Add / Delete Tier helper
  const handleAddTier = () => {
    const newTier: TierItem = {
      id: `t-${Date.now()}`,
      name: `Tier ${formData.tiers.length + 1}`,
      price: formData.currency.includes('USD') ? '$199' : '₹6,499',
      userLimit: 'Up to 50',
      storage: '100 GB',
      features: 'Full Module Access',
    };
    setFormData({ ...formData, tiers: [...formData.tiers, newTier] });
  };

  const handleDeleteTier = (tierId: string) => {
    setFormData({
      ...formData,
      tiers: formData.tiers.filter((t) => t.id !== tierId),
    });
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* ==============================================================
          1. BREADCRUMBS
         ============================================================== */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span
          className="hover:text-slate-800 cursor-pointer"
          onClick={() => router.push('/products/master')}
        >
          Product Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Product Pricing</span>
      </div>

      {/* ==============================================================
          2. HEADER WITH TITLE, DESCRIPTION, AND + ADD PRICING BUTTON
         ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage prices by product, edition, plan, country, and currency.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleStartCreate}
          className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Pricing</span>
        </Button>
      </div>

      {/* ==============================================================
          3. TOP 4 STAT / KPI CARDS (Matching standard design)
         ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pricing Rules */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Tag className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Pricing Rules</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{pricingRules.length + 140}</h3>
          </div>
        </div>

        {/* Card 2: Active Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">112</h3>
          </div>
        </div>

        {/* Card 3: Scheduled Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/70 shrink-0">
            <Clock className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Scheduled Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">18</h3>
          </div>
        </div>

        {/* Card 4: Expired Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100/70 shrink-0">
            <PauseCircle className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Expired Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">18</h3>
          </div>
        </div>
      </div>

      {/* ==============================================================
          4. TOP UNDERLINE NAVIGATION TABS
         ============================================================== */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          {[
            { id: 'rules', label: 'Pricing Rules' },
            { id: 'matrix', label: 'Price Matrix' },
            { id: 'bulk', label: 'Bulk Update' },
            { id: 'history', label: 'Price History' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'pb-3 font-semibold transition-all relative cursor-pointer',
                activeTab === tab.id
                  ? 'text-[#6222cc] border-b-2 border-[#6222cc] -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB 1: PRICING RULES (MAIN SPLIT LIST & FORM VIEW) */}
      {activeTab === 'rules' && (
        <>
          {/* ==============================================================
              5. FILTER BAR
             ============================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {/* Filter 1: Product */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Product</label>
                <div className="relative">
                  <select
                    value={filterProduct}
                    onChange={(e) => {
                      setFilterProduct(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                  >
                    <option value="All">All Products</option>
                    <option value="Pegatto CRM">Pegatto CRM</option>
                    <option value="Pegatto Education">Pegatto Education</option>
                    <option value="Pegatto People (HRMS)">Pegatto People (HRMS)</option>
                    <option value="Pegatto IT">Pegatto IT</option>
                    <option value="Pegatto Retail">Pegatto Retail</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 2: Edition */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Edition</label>
                <div className="relative">
                  <select
                    value={filterEdition}
                    onChange={(e) => {
                      setFilterEdition(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                  >
                    <option value="All">All Editions</option>
                    <option value="Professional">Professional</option>
                    <option value="Standard">Standard</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 3: Plan */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Plan</label>
                <div className="relative">
                  <select
                    value={filterPlan}
                    onChange={(e) => {
                      setFilterPlan(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                  >
                    <option value="All Plans">All Plans</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 4: Country/Region */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Country / Region</label>
                <div className="relative">
                  <select
                    value={filterCountry}
                    onChange={(e) => {
                      setFilterCountry(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                  >
                    <option value="All Countries">All Countries</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="Global">Global</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 5: Currency */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Currency</label>
                <div className="relative">
                  <select
                    value={filterCurrency}
                    onChange={(e) => {
                      setFilterCurrency(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                  >
                    <option value="All Currencies">All Currencies</option>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 6: Status */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Status</label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Reset
              </button>
              <Button
                type="button"
                onClick={() => toast.success('Pricing filters applied')}
                className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 rounded-lg font-medium shadow-2xs cursor-pointer"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* ==============================================================
              6. TWO-COLUMN SPLIT LAYOUT:
                 LEFT: PRICING RULES TABLE (~58% width)
                 RIGHT: DEDICATED CREATE / EDIT / OVERVIEW PANEL (~42% width)
             ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: TABLE CONTAINER */}
            <div className="lg:col-span-7 space-y-3">
              {/* Search bar & Export / Columns buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search product, plan or country..."
                    className="pl-9 h-9 text-xs rounded-xl border-slate-200/90 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleExportCSV}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <FileDown className="h-3.5 w-3.5 text-slate-500" />
                    <span>Export</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info('Column layout customizer')}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                    <span>Columns</span>
                  </Button>
                </div>
              </div>

              {/* Pricing Rules Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                        <th className="py-3 px-3 w-8 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredRules.length > 0 &&
                              selectedRowIds.length === filteredRules.length
                            }
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] h-3.5 w-3.5 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Pricing ID</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Product</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Edition / Plan</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Country</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Price</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Cycle</th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRules.map((rule) => {
                        const isSelected = selectedRowIds.includes(rule.id);
                        const isCurrentDetail = selectedRuleId === rule.id;

                        return (
                          <tr
                            key={rule.id}
                            onClick={() => handleSelectRow(rule)}
                            className={cn(
                              'transition-colors cursor-pointer',
                              isCurrentDetail
                                ? 'bg-[#f8f5ff] border-l-2 border-l-[#6222cc]'
                                : 'hover:bg-slate-50/70'
                            )}
                          >
                            {/* Checkbox */}
                            <td
                              className="py-3 px-3 text-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleRow(rule.id);
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] h-3.5 w-3.5 cursor-pointer"
                              />
                            </td>

                            {/* Pricing ID */}
                            <td className="py-3 px-3 font-mono font-semibold text-[#6222cc] hover:underline whitespace-nowrap">
                              {rule.pricingId}
                            </td>

                            {/* Product */}
                            <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                              {rule.product}
                            </td>

                            {/* Edition / Plan */}
                            <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                              <span className="font-medium text-slate-800">{rule.edition}</span>
                              <span className="text-slate-400 text-[10px] block">{rule.plan}</span>
                            </td>

                            {/* Country */}
                            <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span>{rule.country === 'India' ? '🇮🇳' : rule.country === 'United States' ? '🇺🇸' : '🌐'}</span>
                                <span>{rule.country}</span>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                              {rule.price}
                            </td>

                            {/* Billing Cycle */}
                            <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                              {rule.billingCycle}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span
                                className={cn(
                                  'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                                  rule.status === 'Active'
                                    ? 'bg-[#dcfce7] text-[#15803d]'
                                    : rule.status === 'Scheduled'
                                    ? 'bg-[#fef3c7] text-[#b45309]'
                                    : rule.status === 'Draft'
                                    ? 'bg-[#e0e7ff] text-[#4338ca]'
                                    : 'bg-[#fee2e2] text-[#b91c1c]'
                                )}
                              >
                                {rule.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td
                              className="py-3 px-3 text-center whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(rule)}
                                  className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Edit Pricing in Form"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toast.info(`Options for ${rule.pricingId}`)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
                  <div>
                    Showing 1-{Math.min(paginatedRules.length, filteredRules.length)} of {filteredRules.length} pricing rules
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span>Rows per page:</span>
                      <select
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-50 cursor-pointer"
                      >
                        «
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 cursor-pointer"
                      >
                        &lt;
                      </button>
                      <button
                        type="button"
                        className="h-6 w-6 rounded bg-[#6222cc] text-white font-semibold text-xs flex items-center justify-center shadow-xs"
                      >
                        {currentPage}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 cursor-pointer"
                      >
                        &gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(Math.ceil(filteredRules.length / rowsPerPage))}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 cursor-pointer"
                      >
                        »
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==============================================================
                RIGHT COLUMN: CREATE / EDIT / OVERVIEW PANEL (~42% width)
                Matching Pegatto standard next to the list page
               ============================================================== */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              {/* Panel Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    {panelMode === 'create'
                      ? 'Create Pricing Rule'
                      : panelMode === 'edit'
                      ? `Edit Pricing Rule`
                      : 'Pricing Overview'}
                  </h2>
                  {panelMode !== 'create' && (
                    <span className="font-mono text-xs text-[#6222cc] font-semibold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {formData.pricingId}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                      (panelMode === 'create' ? 'Draft' : formData.status) === 'Active'
                        ? 'bg-[#dcfce7] text-[#15803d]'
                        : (panelMode === 'create' ? 'Draft' : formData.status) === 'Scheduled'
                        ? 'bg-[#fef3c7] text-[#b45309]'
                        : (panelMode === 'create' ? 'Draft' : formData.status) === 'Draft'
                        ? 'bg-[#e0e7ff] text-[#4338ca]'
                        : 'bg-[#fee2e2] text-[#b91c1c]'
                    )}
                  >
                    {panelMode === 'create' ? 'Draft' : formData.status}
                  </span>

                  {panelMode === 'view' ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleStartEdit()}
                      className="h-7 text-xs bg-purple-50 hover:bg-purple-100 text-[#6222cc] border border-purple-200 font-semibold px-2.5 rounded-lg cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      title="Close edit"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Subtabs inside Right Panel */}
              <div className="flex items-center gap-4 sm:gap-6 px-4 pt-3 border-b border-slate-200 text-xs overflow-x-auto">
                {(panelMode === 'create'
                  ? [
                      { id: 'details', label: 'Basic Details' },
                      { id: 'tiers', label: 'Tiered Rates' },
                      { id: 'applicability', label: 'Applicability' },
                      { id: 'taxes', label: 'Taxes & Notes' },
                    ]
                  : [
                      { id: 'overview', label: 'Overview' },
                      { id: 'details', label: 'Pricing Details' },
                      { id: 'tiers', label: 'Tiered Rates' },
                      { id: 'applicability', label: 'Applicability' },
                      { id: 'taxes', label: 'Taxes & Notes' },
                    ]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setRightSubTab(tab.id as any);
                      if (tab.id === 'details' && panelMode === 'view') {
                        setPanelMode('edit');
                      }
                    }}
                    className={cn(
                      'pb-2 transition-colors relative cursor-pointer whitespace-nowrap font-medium',
                      rightSubTab === tab.id
                        ? 'text-[#6222cc] font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    )}
                  >
                    {tab.label}
                    {rightSubTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* ==========================================================
                  SUBTAB 1: OVERVIEW (Rich Visual Details)
                 ========================================================== */}
              {rightSubTab === 'overview' && (
                <div className="p-4 space-y-4 text-xs">
                  {/* Banner with Product Icon and Live Price */}
                  <div className="p-3.5 bg-gradient-to-r from-purple-50/70 to-indigo-50/50 rounded-xl border border-purple-100/80 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-white text-[#6222cc] rounded-xl border border-purple-100 shadow-2xs shrink-0">
                        <Layers className="h-5 w-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{selectedRule.product}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {selectedRule.edition} Edition &bull; <span className="text-[#6222cc] font-medium">{selectedRule.plan} Plan</span>
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-700">
                            {selectedRule.country === 'India' ? '🇮🇳' : selectedRule.country === 'United States' ? '🇺🇸' : '🌐'} {selectedRule.country}
                          </span>
                          <span className="bg-purple-100/70 text-[#6222cc] px-2 py-0.5 rounded-md text-[11px] font-semibold">
                            {selectedRule.licenseUnit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-2xl font-extrabold text-slate-900 block leading-tight">
                        {selectedRule.price}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        / {selectedRule.billingCycle === 'Monthly' ? 'month' : selectedRule.billingCycle === 'Annual' ? 'year' : 'quarter'}
                      </span>
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/40">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Pricing ID</span>
                      <span className="font-mono text-slate-800 font-semibold">{selectedRule.pricingId}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Currency</span>
                      <span className="font-semibold text-slate-800">{selectedRule.currency}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Billing Cycle</span>
                      <span className="font-semibold text-slate-800">{selectedRule.billingCycle}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Effective Period</span>
                      <span className="font-mono text-slate-800 font-medium">
                        {selectedRule.effectiveFrom} &rarr; {selectedRule.effectiveTo || 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Tax Treatment</span>
                      <span className="font-medium text-slate-800">{selectedRule.taxTreatment}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">HSN / SAC Code</span>
                      <span className="font-mono text-slate-700">{selectedRule.hsnCode}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 text-xs">
                      <span className="text-slate-500 font-medium">Tax Rate</span>
                      <span className="font-semibold text-emerald-700">{selectedRule.taxRate}</span>
                    </div>
                  </div>

                  {/* Configured Tiers Summary */}
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Configured Tiers ({selectedRule.tiers.length})
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedRule.tiers.map((tier) => (
                        <div
                          key={tier.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#6222cc]" />
                            <span className="font-semibold text-slate-800">{tier.name}</span>
                            <span className="text-slate-400 text-[11px]">({tier.userLimit})</span>
                          </div>
                          <span className="font-bold text-slate-900">{tier.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overview Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <Button
                      type="button"
                      onClick={() => handleStartEdit()}
                      className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-9 rounded-xl font-semibold gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Pricing Rule</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 text-xs h-9 rounded-xl font-medium gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>Schedule Revision</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* ==========================================================
                  SUBTAB 2: PRICING DETAILS (Edit / Create Form)
                 ========================================================== */}
              {rightSubTab === 'details' && (
                <div className="p-4 space-y-3.5 text-xs">
                  {/* Pricing ID & Code */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Pricing Code / ID <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={formData.pricingId}
                        onChange={(e) => setFormData({ ...formData, pricingId: e.target.value })}
                        className="h-8 text-xs font-mono font-semibold"
                        placeholder="e.g. PRC-000782"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Product <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="Pegatto CRM">Pegatto CRM</option>
                        <option value="Pegatto Education">Pegatto Education</option>
                        <option value="Pegatto People (HRMS)">Pegatto People (HRMS)</option>
                        <option value="Pegatto IT">Pegatto IT</option>
                        <option value="Pegatto Retail">Pegatto Retail</option>
                        <option value="Pegatto Real Estate">Pegatto Real Estate</option>
                      </select>
                    </div>
                  </div>

                  {/* Edition & Plan */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Edition <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.edition}
                        onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Standard">Standard</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Free Core">Free Core</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Plan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Starter">Starter</option>
                        <option value="Free Core">Free Core</option>
                      </select>
                    </div>
                  </div>

                  {/* Country & Currency */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Country / Region <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => {
                          const c = e.target.value;
                          setFormData({
                            ...formData,
                            country: c,
                            countryCode: c === 'India' ? 'IN' : c === 'United States' ? 'US' : 'GL',
                            currency: c === 'India' ? 'INR (₹)' : 'USD ($)',
                          });
                        }}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="India">🇮🇳 India</option>
                        <option value="United States">🇺🇸 United States</option>
                        <option value="Global">🌐 Global</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Currency <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="INR (₹)">INR (₹)</option>
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  {/* Price Display & Numeric */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Price Display <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="h-8 text-xs font-semibold"
                        placeholder="e.g. ₹4,999 or $79"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Billing Cycle <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.billingCycle}
                        onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Annual">Annual (Save 17%)</option>
                        <option value="Quarterly">Quarterly</option>
                      </select>
                    </div>
                  </div>

                  {/* License Unit & Min Quantity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        License Unit <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.licenseUnit}
                        onChange={(e) => setFormData({ ...formData, licenseUnit: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="Per Tenant">Per Tenant</option>
                        <option value="Per User">Per User</option>
                        <option value="Per School">Per School / Campus</option>
                        <option value="Per Usage">Per Usage / API</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Effective From Date
                      </label>
                      <Input
                        value={formData.effectiveFrom}
                        onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                        className="h-8 text-xs font-mono"
                        placeholder="e.g. 01 Jan 2026"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-700 font-medium">
                        Show this pricing for new tenants
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, allowDiscounts: !formData.allowDiscounts })}
                        className={cn(
                          'w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                          formData.allowDiscounts ? 'bg-[#6222cc]' : 'bg-slate-300'
                        )}
                      >
                        <div
                          className={cn(
                            'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                            formData.allowDiscounts ? 'translate-x-4' : 'translate-x-0'
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-700 font-medium">
                        Allow customization at tenant level
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, allowCustomization: !formData.allowCustomization })
                        }
                        className={cn(
                          'w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                          formData.allowCustomization ? 'bg-[#6222cc]' : 'bg-slate-300'
                        )}
                      >
                        <div
                          className={cn(
                            'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                            formData.allowCustomization ? 'translate-x-4' : 'translate-x-0'
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons: Cancel, Save as Draft, Save Pricing Rule */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelForm}
                      className="text-xs h-8 px-3 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSaveForm('Draft')}
                        className="text-xs h-8 px-3 rounded-lg border-purple-200 text-[#6222cc] hover:bg-purple-50 cursor-pointer"
                      >
                        Save as Draft
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleSaveForm('Active')}
                        className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 rounded-lg font-semibold shadow-xs cursor-pointer"
                      >
                        {panelMode === 'create' ? 'Create Pricing' : 'Save Pricing'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================================
                  SUBTAB 3: TIERED RATES (Configurable Brackets)
                 ========================================================== */}
              {rightSubTab === 'tiers' && (
                <div className="p-4 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Volume & Tiered Pricing</h4>
                      <p className="text-[11px] text-slate-500">
                        Configure stepped rates by user limit or usage metrics.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddTier}
                      className="bg-purple-50 hover:bg-purple-100 text-[#6222cc] text-xs h-7 px-2.5 rounded-lg border border-purple-200 font-semibold cursor-pointer"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Tier
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.tiers.map((tier, idx) => (
                      <div
                        key={tier.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">
                            Tier {idx + 1}: {tier.name}
                          </span>
                          {formData.tiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTier(tier.id)}
                              className="text-slate-400 hover:text-rose-500 p-1"
                              title="Delete Tier"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-medium">Tier Name</label>
                            <Input
                              value={tier.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData({
                                  ...formData,
                                  tiers: formData.tiers.map((t) =>
                                    t.id === tier.id ? { ...t, name: val } : t
                                  ),
                                });
                              }}
                              className="h-7 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-medium">Price</label>
                            <Input
                              value={tier.price}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData({
                                  ...formData,
                                  tiers: formData.tiers.map((t) =>
                                    t.id === tier.id ? { ...t, price: val } : t
                                  ),
                                });
                              }}
                              className="h-7 text-xs font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-medium">User Limit</label>
                            <Input
                              value={tier.userLimit}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData({
                                  ...formData,
                                  tiers: formData.tiers.map((t) =>
                                    t.id === tier.id ? { ...t, userLimit: val } : t
                                  ),
                                });
                              }}
                              className="h-7 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelForm}
                      className="text-xs h-8 px-3 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSaveForm('Draft')}
                        className="text-xs h-8 px-3 rounded-lg border-purple-200 text-[#6222cc] hover:bg-purple-50 cursor-pointer font-medium"
                      >
                        Save as Draft
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleSaveForm('Active')}
                        className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 rounded-lg font-semibold shadow-xs cursor-pointer"
                      >
                        {panelMode === 'create' ? 'Create Pricing' : 'Save Pricing'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================================
                  SUBTAB 4: APPLICABILITY (Target Segments & Policies)
                 ========================================================== */}
              {rightSubTab === 'applicability' && (
                <div className="p-4 space-y-3.5 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">Target Tenant Segments</h4>
                    <p className="text-[11px] text-slate-500">
                      Specify which customer cohorts are eligible to subscribe to this price rule.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Small Business', 'Mid Market', 'Enterprise', 'Education', 'Government', 'Startups'].map(
                      (segment) => {
                        const isSelected = formData.applicableSegments.includes(segment);
                        return (
                          <button
                            key={segment}
                            type="button"
                            onClick={() => {
                              const updated = isSelected
                                ? formData.applicableSegments.filter((s) => s !== segment)
                                : [...formData.applicableSegments, segment];
                              setFormData({ ...formData, applicableSegments: updated });
                            }}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5',
                              isSelected
                                ? 'bg-[#6222cc] text-white border-[#6222cc] shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            )}
                          >
                            <span>{segment}</span>
                            {isSelected && <Check className="h-3 w-3" />}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Allow Promotional Coupons</span>
                      <input
                        type="checkbox"
                        checked={formData.allowDiscounts}
                        onChange={(e) => setFormData({ ...formData, allowDiscounts: e.target.checked })}
                        className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-4 w-4 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Support Prorated Upgrades</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-4 w-4 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelForm}
                      className="text-xs h-8 px-3 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSaveForm('Draft')}
                        className="text-xs h-8 px-3 rounded-lg border-purple-200 text-[#6222cc] hover:bg-purple-50 cursor-pointer font-medium"
                      >
                        Save as Draft
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleSaveForm('Active')}
                        className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 rounded-lg font-semibold shadow-xs cursor-pointer"
                      >
                        {panelMode === 'create' ? 'Create Pricing' : 'Save Pricing'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================================
                  SUBTAB 5: TAXES & NOTES
                 ========================================================== */}
              {rightSubTab === 'taxes' && (
                <div className="p-4 space-y-3.5 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">Tax Treatment & Invoicing</h4>
                    <p className="text-[11px] text-slate-500">
                      Configure tax classifications and invoice footer declarations.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Tax Treatment</label>
                    <select
                      value={formData.taxTreatment}
                      onChange={(e) => setFormData({ ...formData, taxTreatment: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800"
                    >
                      <option value="Exclusive of Tax">Exclusive of Tax (Default)</option>
                      <option value="Inclusive of Tax">Inclusive of Tax</option>
                      <option value="Tax Exempt / Zero Rated">Tax Exempt / Zero Rated</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">HSN / SAC Code</label>
                      <Input
                        value={formData.hsnCode}
                        onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                        className="h-8 text-xs font-mono"
                        placeholder="e.g. 998314"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Tax Rate %</label>
                      <Input
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                        className="h-8 text-xs"
                        placeholder="e.g. 18% GST"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Invoicing Declaration</label>
                    <textarea
                      rows={3}
                      value={formData.invoicingNotes}
                      onChange={(e) => setFormData({ ...formData, invoicingNotes: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      placeholder="Special tax or regulatory invoice notes..."
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelForm}
                      className="text-xs h-8 px-3 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSaveForm('Draft')}
                        className="text-xs h-8 px-3 rounded-lg border-purple-200 text-[#6222cc] hover:bg-purple-50 cursor-pointer font-medium"
                      >
                        Save as Draft
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleSaveForm('Active')}
                        className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 rounded-lg font-semibold shadow-xs cursor-pointer"
                      >
                        {panelMode === 'create' ? 'Create Pricing' : 'Save Pricing'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: PRICE MATRIX (Cross-edition x Currency matrix) */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Multi-Currency Price Matrix</h3>
              <p className="text-xs text-slate-500">
                Compare edition base rates across international regions and currencies.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => toast.success('Matrix synced with global currency rates')}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-3 rounded-lg"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Sync FX Rates
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                  <th className="py-3 px-3">Product & Edition</th>
                  <th className="py-3 px-3">Billing</th>
                  <th className="py-3 px-3">India (INR ₹)</th>
                  <th className="py-3 px-3">United States (USD $)</th>
                  <th className="py-3 px-3">Europe (EUR €)</th>
                  <th className="py-3 px-3">United Kingdom (GBP £)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { prod: 'Pegatto CRM (Pro)', cycle: 'Monthly', inr: '₹4,999', usd: '$79', eur: '€75', gbp: '£65', status: 'Active' },
                  { prod: 'Pegatto CRM (Pro)', cycle: 'Annual', inr: '₹49,999', usd: '$799', eur: '€750', gbp: '£650', status: 'Active' },
                  { prod: 'Pegatto CRM (Enterprise)', cycle: 'Monthly', inr: '₹14,999', usd: '$199', eur: '€185', gbp: '£160', status: 'Active' },
                  { prod: 'Pegatto Education', cycle: 'Monthly', inr: '₹9,999', usd: '$149', eur: '€140', gbp: '£120', status: 'Active' },
                  { prod: 'Pegatto People (HRMS)', cycle: 'Monthly', inr: '₹7,999', usd: '$119', eur: '€110', gbp: '£95', status: 'Active' },
                  { prod: 'Pegatto IT Ops', cycle: 'Monthly', inr: '₹12,499', usd: '$189', eur: '€175', gbp: '£150', status: 'Scheduled' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold text-slate-900">{row.prod}</td>
                    <td className="py-3 px-3 text-slate-600">{row.cycle}</td>
                    <td className="py-3 px-3 font-bold text-slate-800 font-mono">{row.inr}</td>
                    <td className="py-3 px-3 font-bold text-slate-800 font-mono">{row.usd}</td>
                    <td className="py-3 px-3 font-bold text-slate-800 font-mono">{row.eur}</td>
                    <td className="py-3 px-3 font-bold text-slate-800 font-mono">{row.gbp}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BULK UPDATE */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 max-w-2xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bulk Price Adjustment</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Apply a percentage increase or decrease across multiple products and currencies simultaneously.
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Target Product</label>
                <select className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800">
                  <option>All Products</option>
                  <option>Pegatto CRM</option>
                  <option>Pegatto Education</option>
                  <option>Pegatto People</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Target Currency</label>
                <select className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800">
                  <option>All Currencies</option>
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Adjustment Type</label>
                <select className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800">
                  <option>Increase by Percentage (%)</option>
                  <option>Decrease by Percentage (%)</option>
                  <option>Fixed Amount Addition</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Adjustment Value</label>
                <Input defaultValue="5%" className="h-8 text-xs font-bold" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Effective Scheduled Date</label>
              <Input type="date" defaultValue="2026-07-01" className="h-8 text-xs" />
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-800 flex items-start gap-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                This change will impact 24 pricing rules. Existing active tenant subscriptions will be grandfathered until renewal.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-8 px-3 rounded-lg border-slate-200"
              >
                Preview Impact
              </Button>
              <Button
                type="button"
                onClick={() => toast.success('Bulk price adjustment scheduled!')}
                className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 rounded-lg font-semibold"
              >
                Schedule Bulk Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRICE HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pricing Audit Trail & History</h3>
            <p className="text-xs text-slate-500">
              Complete chronological log of price updates, edition changes, and schedule modifications.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Pricing ID</th>
                  <th className="py-3 px-3">Product / Edition</th>
                  <th className="py-3 px-3">Old Price</th>
                  <th className="py-3 px-3">New Price</th>
                  <th className="py-3 px-3">Changed By</th>
                  <th className="py-3 px-3">Reason</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { date: '18 Nov 2026, 11:20 AM', id: 'PRC-000782', prod: 'Pegatto CRM (Pro)', old: '₹4,499', nw: '₹4,999', by: 'Super Admin', reason: 'Annual inflation revision', status: 'Applied' },
                  { date: '15 Oct 2026, 04:15 PM', id: 'PRC-000783', prod: 'Pegatto CRM (Annual)', old: '₹44,999', nw: '₹49,999', by: 'Finance Ops', reason: 'Feature pack inclusion', status: 'Applied' },
                  { date: '01 Sep 2026, 09:30 AM', id: 'PRC-000787', prod: 'Pegatto People (HRMS)', old: '$129', nw: '$149', by: 'Product Manager', reason: 'Global currency alignment', status: 'Applied' },
                  { date: '12 Aug 2026, 02:45 PM', id: 'PRC-000784', prod: 'Pegatto CRM (US)', old: '$69', nw: '$79', by: 'Super Admin', reason: 'US market revision', status: 'Applied' },
                ].map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">{log.date}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-[#6222cc]">{log.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{log.prod}</td>
                    <td className="py-3 px-3 text-slate-400 line-through font-mono">{log.old}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 font-mono">{log.nw}</td>
                    <td className="py-3 px-3 text-slate-700">{log.by}</td>
                    <td className="py-3 px-3 text-slate-600">{log.reason}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCHEDULE FUTURE CHANGE MODAL */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Schedule Future Price Change
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Set a future effective date for price revision of {selectedRule.pricingId} ({selectedRule.product}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Future Effective Date</label>
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">New Proposed Price</label>
              <Input
                value={newProposedPrice}
                onChange={(e) => setNewProposedPrice(e.target.value)}
                className="text-xs h-9 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Notification Lead Time</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium">
                <option>Notify tenants 30 days in advance</option>
                <option>Notify tenants 60 days in advance</option>
                <option>Immediate notice on invoice</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsScheduleModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsScheduleModalOpen(false);
                toast.success(`Price revision to ${newProposedPrice} scheduled for ${scheduleDate}!`);
              }}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold"
            >
              Schedule Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
