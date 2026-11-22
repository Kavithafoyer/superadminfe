'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Key,
  CheckCircle2,
  Clock,
  Ban,
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  MoreVertical,
  Calendar,
  Check,
  Shield,
  Layers,
  AlertCircle,
  FileCheck,
  Users,
  Building,
  RotateCcw,
  Sparkles,
  BarChart2,
  FileText,
  Copy,
  Trash2,
  X,
  Lock,
  AlertTriangle,
  TrendingUp,
  Coins,
  Percent,
  ExternalLink,
  RefreshCw,
  Sliders,
  Eye,
  Mail,
  ArrowUpRight,
  Activity,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  CreditCard,
  Send,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export interface EntitlementItem {
  feature: string;
  status: 'Enabled' | 'Disabled';
  quota: string;
}

export interface LicenseItem {
  id: string;
  licenseKey: string;
  customerTenant: string;
  product: string;
  productColor: string;
  planEdition: string;
  users: number;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Expiring' | 'Suspended' | 'Revoked';
  activatedOn: string;
  lastActivity: string;
  entitlements: EntitlementItem[];
}

export interface MasterEntitlement {
  id: string;
  code: string;
  name: string;
  category: 'Base Platform' | 'Intelligence' | 'Communication' | 'Reporting' | 'Infrastructure' | 'Security';
  product: string;
  defaultQuota: string;
  quotaType: 'Unlimited' | 'Per Seat' | 'Per Integration' | 'Storage' | 'Enterprise';
  status: 'Active' | 'Draft';
  activeTenants: number;
  description: string;
}

export interface TenantAssignment {
  id: string;
  tenantName: string;
  product: string;
  licenseKey: string;
  planEdition: string;
  totalSeats: number;
  activeSeats: number;
  lastAssigned: string;
  overAllocated: boolean;
}

export interface ComplianceAlert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  tenantName: string;
  licenseKey: string;
  issue: string;
  details: string;
  detectedAt: string;
  status: 'Open' | 'Grace Period' | 'Resolved';
}

export interface RenewalRecord {
  id: string;
  licenseKey: string;
  customerTenant: string;
  product: string;
  planEdition: string;
  expiryDate: string;
  daysRemaining: number;
  contractValue: string;
  renewalStatus: 'Invoice Sent' | 'Pending Action' | 'Auto-Renew Queued' | 'Payment Failed';
  paymentMethod: string;
  autoRenew: boolean;
}

const INITIAL_LICENSES: LicenseItem[] = [
  {
    id: 'lic-1',
    licenseKey: 'PGT-CRM-100458',
    customerTenant: 'Euro Textiles',
    product: 'Pegatto CRM',
    productColor: 'bg-purple-100 text-purple-800',
    planEdition: 'Professional',
    users: 25,
    validFrom: '01 Oct 2026',
    validTo: '30 Sep 2027',
    status: 'Active',
    activatedOn: '01 Oct 2026',
    lastActivity: '19 Nov 2026, 10:24 AM',
    entitlements: [
      { feature: 'Core CRM (Leads, Contacts, Deals)', status: 'Enabled', quota: 'Included' },
      { feature: 'AI Lead Scoring', status: 'Enabled', quota: '25 Users' },
      { feature: 'WhatsApp Integration', status: 'Enabled', quota: '1 Integration' },
      { feature: 'Analytics & Reports', status: 'Enabled', quota: 'Included' },
      { feature: 'Additional Storage', status: 'Enabled', quota: '100 GB' },
    ],
  },
  {
    id: 'lic-2',
    licenseKey: 'PGT-EDU-100459',
    customerTenant: 'Sunrise School',
    product: 'Pegatto Education',
    productColor: 'bg-blue-100 text-blue-800',
    planEdition: 'Enterprise',
    users: 100,
    validFrom: '15 Oct 2026',
    validTo: '14 Oct 2027',
    status: 'Active',
    activatedOn: '15 Oct 2026',
    lastActivity: '18 Nov 2026, 04:12 PM',
    entitlements: [
      { feature: 'Student Information System', status: 'Enabled', quota: 'Included' },
      { feature: 'Attendance & Timetable', status: 'Enabled', quota: 'Included' },
      { feature: 'Parent-Teacher Portal', status: 'Enabled', quota: '500 Portals' },
      { feature: 'Gradebook & Exams', status: 'Enabled', quota: 'Unlimited' },
    ],
  },
  {
    id: 'lic-3',
    licenseKey: 'PGT-IT-100460',
    customerTenant: 'Prodian Infotech',
    product: 'Pegatto IT',
    productColor: 'bg-teal-100 text-teal-800',
    planEdition: 'Professional',
    users: 50,
    validFrom: '01 Sep 2026',
    validTo: '31 Aug 2027',
    status: 'Active',
    activatedOn: '01 Sep 2026',
    lastActivity: '19 Nov 2026, 09:15 AM',
    entitlements: [
      { feature: 'IT Service Desk & Assets', status: 'Enabled', quota: 'Included' },
      { feature: 'Incident Management', status: 'Enabled', quota: '50 Agents' },
      { feature: 'Automated SLAs', status: 'Enabled', quota: 'Custom SLAs' },
    ],
  },
  {
    id: 'lic-4',
    licenseKey: 'PGT-PEO-100461',
    customerTenant: 'Apex Solutions',
    product: 'Pegatto People',
    productColor: 'bg-amber-100 text-amber-800',
    planEdition: 'Standard',
    users: 50,
    validFrom: '01 Aug 2026',
    validTo: '31 Jul 2027',
    status: 'Expiring',
    activatedOn: '01 Aug 2026',
    lastActivity: '12 Nov 2026, 02:40 PM',
    entitlements: [
      { feature: 'Core HRMS & Directory', status: 'Enabled', quota: 'Included' },
      { feature: 'Leave & Attendance Tracking', status: 'Enabled', quota: '50 Employees' },
    ],
  },
  {
    id: 'lic-5',
    licenseKey: 'PGT-RTL-100462',
    customerTenant: 'Indra Store',
    product: 'Pegatto Retail',
    productColor: 'bg-emerald-100 text-emerald-800',
    planEdition: 'Professional',
    users: 15,
    validFrom: '10 Nov 2025',
    validTo: '09 Nov 2026',
    status: 'Active',
    activatedOn: '10 Nov 2025',
    lastActivity: '17 Nov 2026, 11:05 AM',
    entitlements: [
      { feature: 'POS Billing & Cashier Desk', status: 'Enabled', quota: '15 Registers' },
      { feature: 'Inventory & Barcode Scanning', status: 'Enabled', quota: 'Included' },
    ],
  },
  {
    id: 'lic-6',
    licenseKey: 'PGT-REA-100463',
    customerTenant: 'City Builders',
    product: 'Pegatto Real Estate',
    productColor: 'bg-blue-100 text-[#0d62e0]',
    planEdition: 'Enterprise',
    users: 75,
    validFrom: '01 Oct 2026',
    validTo: '30 Sep 2027',
    status: 'Active',
    activatedOn: '01 Oct 2026',
    lastActivity: '19 Nov 2026, 08:30 AM',
    entitlements: [
      { feature: 'Property & Unit Inventory', status: 'Enabled', quota: 'Included' },
      { feature: 'Booking & Payment Schedules', status: 'Enabled', quota: '75 Agents' },
    ],
  },
  {
    id: 'lic-7',
    licenseKey: 'PGT-CRM-100464',
    customerTenant: 'Style Union',
    product: 'Pegatto CRM',
    productColor: 'bg-purple-100 text-purple-800',
    planEdition: 'Standard',
    users: 10,
    validFrom: '01 Jul 2026',
    validTo: '30 Jun 2027',
    status: 'Suspended',
    activatedOn: '01 Jul 2026',
    lastActivity: '02 Oct 2026, 05:22 PM',
    entitlements: [
      { feature: 'Core CRM (Standard)', status: 'Disabled', quota: 'Suspended' },
    ],
  },
  {
    id: 'lic-8',
    licenseKey: 'PGT-EDU-100465',
    customerTenant: 'Delta Academy',
    product: 'Pegatto Education',
    productColor: 'bg-blue-100 text-blue-800',
    planEdition: 'Professional',
    users: 50,
    validFrom: '01 Jun 2026',
    validTo: '31 May 2027',
    status: 'Active',
    activatedOn: '01 Jun 2026',
    lastActivity: '16 Nov 2026, 01:10 PM',
    entitlements: [
      { feature: 'Student Information System', status: 'Enabled', quota: 'Included' },
      { feature: 'Attendance & Timetable', status: 'Enabled', quota: 'Included' },
    ],
  },
];

const INITIAL_MASTER_ENTITLEMENTS: MasterEntitlement[] = [
  {
    id: 'ment-1',
    code: 'ENT-CRM-CORE',
    name: 'Core CRM (Leads, Deals, Pipelines)',
    category: 'Base Platform',
    product: 'Pegatto CRM',
    defaultQuota: 'Included',
    quotaType: 'Unlimited',
    status: 'Active',
    activeTenants: 1240,
    description: 'Foundation CRM sales pipeline and lead capture engine with audit trails.',
  },
  {
    id: 'ment-2',
    code: 'ENT-AI-SCORE',
    name: 'AI Predictive Lead Scoring Engine',
    category: 'Intelligence',
    product: 'Pegatto CRM',
    defaultQuota: '25 Users',
    quotaType: 'Per Seat',
    status: 'Active',
    activeTenants: 890,
    description: 'Autonomous ML lead propensity scoring and automated deal health diagnostics.',
  },
  {
    id: 'ment-3',
    code: 'ENT-WHATSAPP',
    name: 'WhatsApp Business Messaging Connector',
    category: 'Communication',
    product: 'Pegatto CRM',
    defaultQuota: '1 Integration',
    quotaType: 'Per Integration',
    status: 'Active',
    activeTenants: 640,
    description: 'Cloud API integration for interactive customer templates and dispatch.',
  },
  {
    id: 'ment-4',
    code: 'ENT-ANALYTICS',
    name: 'Advanced Business Intelligence & Reporting',
    category: 'Reporting',
    product: 'Pegatto CRM',
    defaultQuota: 'Included',
    quotaType: 'Unlimited',
    status: 'Active',
    activeTenants: 1120,
    description: 'Cross-module revenue analytics, cohorts, custom query builder, and scheduled CSV/PDF.',
  },
  {
    id: 'ment-5',
    code: 'ENT-STORAGE-100',
    name: 'Cloud Storage 100GB Bucket',
    category: 'Infrastructure',
    product: 'All Products',
    defaultQuota: '100 GB',
    quotaType: 'Storage',
    status: 'Active',
    activeTenants: 520,
    description: 'Dedicated S3-compatible tenant storage bucket for records, assets, and invoices.',
  },
  {
    id: 'ment-6',
    code: 'ENT-EDU-SIS',
    name: 'Student Information System (SIS)',
    category: 'Base Platform',
    product: 'Pegatto Education',
    defaultQuota: 'Included',
    quotaType: 'Unlimited',
    status: 'Active',
    activeTenants: 480,
    description: 'Admissions, student lifecycle, academic grading, and compliance registers.',
  },
  {
    id: 'ment-7',
    code: 'ENT-PORTAL-PT',
    name: 'Parent-Teacher Web & Mobile Portals',
    category: 'Communication',
    product: 'Pegatto Education',
    defaultQuota: '500 Portals',
    quotaType: 'Per Seat',
    status: 'Active',
    activeTenants: 420,
    description: 'Real-time student progress tracking, fee receipts, and parent communication portal.',
  },
  {
    id: 'ment-8',
    code: 'ENT-ITSM-ASSET',
    name: 'IT Asset & Service Desk Management',
    category: 'Base Platform',
    product: 'Pegatto IT',
    defaultQuota: '50 Agents',
    quotaType: 'Per Seat',
    status: 'Active',
    activeTenants: 310,
    description: 'Asset discovery, incident ticketing, change requests, and automated SLA rules.',
  },
];

const INITIAL_ASSIGNMENTS: TenantAssignment[] = [
  { id: 'asgn-1', tenantName: 'Euro Textiles', product: 'Pegatto CRM', licenseKey: 'PGT-CRM-100458', planEdition: 'Professional', totalSeats: 25, activeSeats: 23, lastAssigned: '19 Nov 2026', overAllocated: false },
  { id: 'asgn-2', tenantName: 'Sunrise School', product: 'Pegatto Education', licenseKey: 'PGT-EDU-100459', planEdition: 'Enterprise', totalSeats: 100, activeSeats: 98, lastAssigned: '18 Nov 2026', overAllocated: false },
  { id: 'asgn-3', tenantName: 'Prodian Infotech', product: 'Pegatto IT', licenseKey: 'PGT-IT-100460', planEdition: 'Professional', totalSeats: 50, activeSeats: 46, lastAssigned: '19 Nov 2026', overAllocated: false },
  { id: 'asgn-4', tenantName: 'Apex Solutions', product: 'Pegatto People', licenseKey: 'PGT-PEO-100461', planEdition: 'Standard', totalSeats: 50, activeSeats: 50, lastAssigned: '12 Nov 2026', overAllocated: false },
  { id: 'asgn-5', tenantName: 'Indra Store', product: 'Pegatto Retail', licenseKey: 'PGT-RTL-100462', planEdition: 'Professional', totalSeats: 15, activeSeats: 12, lastAssigned: '17 Nov 2026', overAllocated: false },
  { id: 'asgn-6', tenantName: 'City Builders', product: 'Pegatto Real Estate', licenseKey: 'PGT-REA-100463', planEdition: 'Enterprise', totalSeats: 75, activeSeats: 74, lastAssigned: '19 Nov 2026', overAllocated: false },
  { id: 'asgn-7', tenantName: 'Style Union', product: 'Pegatto CRM', licenseKey: 'PGT-CRM-100464', planEdition: 'Standard', totalSeats: 10, activeSeats: 11, lastAssigned: '02 Oct 2026', overAllocated: true },
  { id: 'asgn-8', tenantName: 'Delta Academy', product: 'Pegatto Education', licenseKey: 'PGT-EDU-100465', planEdition: 'Professional', totalSeats: 50, activeSeats: 42, lastAssigned: '16 Nov 2026', overAllocated: false },
];

const INITIAL_COMPLIANCE_ALERTS: ComplianceAlert[] = [
  {
    id: 'cmp-1',
    severity: 'Critical',
    tenantName: 'Style Union',
    licenseKey: 'PGT-CRM-100464',
    issue: 'Seat Overrun (11 Active / 10 Licensed)',
    details: 'Tenant exceeded allocated user seat capacity by 1 seat. Concurrent login throttle initiated.',
    detectedAt: '21 Nov 2026, 09:30 AM',
    status: 'Open',
  },
  {
    id: 'cmp-2',
    severity: 'Warning',
    tenantName: 'Apex Solutions',
    licenseKey: 'PGT-PEO-100461',
    issue: 'Subscription Approaching Expiry (12 Days Remaining)',
    details: 'Automated renewal notice sent. Payment authorization pending in gateway.',
    detectedAt: '20 Nov 2026, 04:15 PM',
    status: 'Grace Period',
  },
  {
    id: 'cmp-3',
    severity: 'Warning',
    tenantName: 'City Builders',
    licenseKey: 'PGT-REA-100463',
    issue: 'High API Consumption Rate',
    details: 'Webhook rate exceeded 45,000 requests/day threshold (90% of daily quota).',
    detectedAt: '19 Nov 2026, 07:45 PM',
    status: 'Open',
  },
  {
    id: 'cmp-4',
    severity: 'Info',
    tenantName: 'Sunrise School',
    licenseKey: 'PGT-EDU-100459',
    issue: 'Storage Capacity Approaching 85%',
    details: 'Tenant object storage currently at 84.8 GB of 100 GB tier allocation.',
    detectedAt: '18 Nov 2026, 11:20 AM',
    status: 'Open',
  },
];

const INITIAL_RENEWALS: RenewalRecord[] = [
  {
    id: 'ren-1',
    licenseKey: 'PGT-PEO-100461',
    customerTenant: 'Apex Solutions',
    product: 'Pegatto People',
    planEdition: 'Standard',
    expiryDate: '04 Dec 2026',
    daysRemaining: 12,
    contractValue: '₹5,988 /yr',
    renewalStatus: 'Invoice Sent',
    paymentMethod: 'Net Banking (HDFC)',
    autoRenew: true,
  },
  {
    id: 'ren-2',
    licenseKey: 'PGT-RTL-100462',
    customerTenant: 'Indra Store',
    product: 'Pegatto Retail',
    planEdition: 'Professional',
    expiryDate: '28 Nov 2026',
    daysRemaining: 6,
    contractValue: '₹17,988 /yr',
    renewalStatus: 'Pending Action',
    paymentMethod: 'Credit Card (Visa)',
    autoRenew: false,
  },
  {
    id: 'ren-3',
    licenseKey: 'PGT-CRM-100464',
    customerTenant: 'Style Union',
    product: 'Pegatto CRM',
    planEdition: 'Standard',
    expiryDate: '15 Dec 2026',
    daysRemaining: 23,
    contractValue: '₹5,988 /yr',
    renewalStatus: 'Payment Failed',
    paymentMethod: 'Credit Card (Mastercard)',
    autoRenew: true,
  },
  {
    id: 'ren-4',
    licenseKey: 'PGT-EDU-100465',
    customerTenant: 'Delta Academy',
    product: 'Pegatto Education',
    planEdition: 'Professional',
    expiryDate: '20 Dec 2026',
    daysRemaining: 28,
    contractValue: '₹29,988 /yr',
    renewalStatus: 'Auto-Renew Queued',
    paymentMethod: 'Corporate ACH',
    autoRenew: true,
  },
];

export function LicenseEntitlementsScreen() {
  const router = useRouter();

  // Active top tab
  const [activeTab, setActiveTab] = useState<'licenses' | 'entitlements' | 'assignments' | 'compliance' | 'renewals'>('licenses');

  // Licenses state
  const [licenses, setLicenses] = useState<LicenseItem[]>(INITIAL_LICENSES);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>('lic-1');

  // Master Entitlements state (Tab 2)
  const [masterEntitlements, setMasterEntitlements] = useState<MasterEntitlement[]>(INITIAL_MASTER_ENTITLEMENTS);
  const [selectedEntitlementId, setSelectedEntitlementId] = useState<string>('ment-1');
  const [entitlementFilterCategory, setEntitlementFilterCategory] = useState<string>('All Categories');
  const [isNewEntitlementModalOpen, setIsNewEntitlementModalOpen] = useState(false);
  const [newEntitlementForm, setNewEntitlementForm] = useState({
    code: 'ENT-CUSTOM',
    name: '',
    category: 'Base Platform' as MasterEntitlement['category'],
    product: 'Pegatto CRM',
    defaultQuota: 'Included',
    quotaType: 'Unlimited' as MasterEntitlement['quotaType'],
    description: '',
  });

  // Assignments state (Tab 3)
  const [assignments, setAssignments] = useState<TenantAssignment[]>(INITIAL_ASSIGNMENTS);
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [isManageSeatsModalOpen, setIsManageSeatsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<TenantAssignment | null>(null);

  // Compliance state (Tab 4)
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>(INITIAL_COMPLIANCE_ALERTS);

  // Renewals state (Tab 5)
  const [renewals, setRenewals] = useState<RenewalRecord[]>(INITIAL_RENEWALS);
  const [selectedRenewalIds, setSelectedRenewalIds] = useState<string[]>([]);
  const [renewalFilter, setRenewalFilter] = useState<'All' | 'Urgent' | 'Standard' | 'Failed'>('All');

  // Filters for Licenses Tab (Tab 1)
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterTenant, setFilterTenant] = useState('All Tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog States for Licenses
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Issue License Form State
  const [newLicenseForm, setNewLicenseForm] = useState<{
    customerTenant: string;
    product: string;
    planEdition: string;
    users: number;
    validFrom: string;
    validTo: string;
    licenseType: string;
    entitlements: EntitlementItem[];
  }>({
    customerTenant: '',
    product: 'Pegatto CRM',
    planEdition: 'Professional',
    users: 25,
    validFrom: '22 Nov 2026',
    validTo: '21 Nov 2027',
    licenseType: 'Subscription',
    entitlements: [
      { feature: 'Core Modules', status: 'Enabled', quota: 'Included' },
      { feature: 'AI Lead Scoring', status: 'Enabled', quota: '25 Users' },
      { feature: 'WhatsApp Integration', status: 'Enabled', quota: '1 Integration' },
      { feature: 'Analytics & Reports', status: 'Enabled', quota: 'Included' },
      { feature: 'Additional Storage', status: 'Enabled', quota: '50 GB' },
    ],
  });

  // Edit Entitlements Form State
  const [editingLicense, setEditingLicense] = useState<LicenseItem | null>(null);

  const selectedLicense = licenses.find((l) => l.id === selectedLicenseId) || licenses[0];
  const selectedMasterEntitlement = masterEntitlements.find((m) => m.id === selectedEntitlementId) || masterEntitlements[0];

  // Filtering for Tab 1
  const filteredLicenses = licenses.filter((lic) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lic.licenseKey.toLowerCase().includes(q) ||
      lic.customerTenant.toLowerCase().includes(q) ||
      lic.product.toLowerCase().includes(q);
    const matchesProduct = filterProduct === 'All Products' || lic.product === filterProduct;
    const matchesPlan = filterPlan === 'All Plans' || lic.planEdition === filterPlan;
    const matchesStatus = filterStatus === 'All Status' || lic.status === filterStatus;
    const matchesTenant = filterTenant === 'All Tenants' || lic.customerTenant === filterTenant;
    return matchesSearch && matchesProduct && matchesPlan && matchesStatus && matchesTenant;
  });

  // Open Issue Modal
  const handleOpenIssueModal = () => {
    setNewLicenseForm({
      customerTenant: 'Apex Global Ltd',
      product: 'Pegatto CRM',
      planEdition: 'Professional',
      users: 50,
      validFrom: '22 Nov 2026',
      validTo: '21 Nov 2027',
      licenseType: 'Subscription',
      entitlements: [
        { feature: 'Core Modules', status: 'Enabled', quota: 'Included' },
        { feature: 'AI Lead Scoring', status: 'Enabled', quota: '50 Users' },
        { feature: 'WhatsApp Integration', status: 'Enabled', quota: '1 Integration' },
        { feature: 'Analytics & Reports', status: 'Enabled', quota: 'Included' },
        { feature: 'Additional Storage', status: 'Enabled', quota: '100 GB' },
      ],
    });
    setIsIssueModalOpen(true);
  };

  // Submit Issue License
  const handleCreateLicense = () => {
    if (!newLicenseForm.customerTenant.trim()) {
      toast.error('Please enter a Customer / Tenant name');
      return;
    }

    const keyPrefix =
      newLicenseForm.product === 'Pegatto Education' ? 'PGT-EDU' :
      newLicenseForm.product === 'Pegatto IT' ? 'PGT-IT' :
      newLicenseForm.product === 'Pegatto People' ? 'PGT-PEO' :
      newLicenseForm.product === 'Pegatto Retail' ? 'PGT-RTL' :
      newLicenseForm.product === 'Pegatto Real Estate' ? 'PGT-REA' : 'PGT-CRM';

    const randomKeyNum = Math.floor(100466 + Math.random() * 900);
    const newKey = `${keyPrefix}-${randomKeyNum}`;

    const colorMap: Record<string, string> = {
      'Pegatto CRM': 'bg-purple-100 text-purple-800',
      'Pegatto Education': 'bg-blue-100 text-blue-800',
      'Pegatto IT': 'bg-teal-100 text-teal-800',
      'Pegatto People': 'bg-amber-100 text-amber-800',
      'Pegatto Retail': 'bg-emerald-100 text-emerald-800',
      'Pegatto Real Estate': 'bg-blue-100 text-[#0d62e0]',
    };

    const newItem: LicenseItem = {
      id: `lic-${Date.now()}`,
      licenseKey: newKey,
      customerTenant: newLicenseForm.customerTenant,
      product: newLicenseForm.product,
      productColor: colorMap[newLicenseForm.product] || 'bg-purple-100 text-purple-800',
      planEdition: newLicenseForm.planEdition,
      users: Number(newLicenseForm.users) || 25,
      validFrom: newLicenseForm.validFrom,
      validTo: newLicenseForm.validTo,
      status: 'Active',
      activatedOn: newLicenseForm.validFrom,
      lastActivity: 'Just now',
      entitlements: newLicenseForm.entitlements,
    };

    setLicenses((prev) => [newItem, ...prev]);
    setSelectedLicenseId(newItem.id);
    setIsIssueModalOpen(false);
    toast.success(`License ${newKey} issued successfully for ${newItem.customerTenant}!`);
  };

  // Open Edit Entitlements Modal
  const handleOpenEditModal = (licToEdit?: LicenseItem) => {
    const target = licToEdit || selectedLicense;
    setEditingLicense(JSON.parse(JSON.stringify(target)));
    setIsEditModalOpen(true);
  };

  // Save Edit Entitlements
  const handleSaveEditLicense = () => {
    if (!editingLicense) return;
    setLicenses((prev) => prev.map((l) => (l.id === editingLicense.id ? editingLicense : l)));
    setIsEditModalOpen(false);
    toast.success(`License ${editingLicense.licenseKey} entitlements updated!`);
  };

  // Action: Suspend
  const handleSuspendLicense = (lic: LicenseItem) => {
    const updatedStatus = lic.status === 'Suspended' ? 'Active' : 'Suspended';
    setLicenses((prev) =>
      prev.map((l) => (l.id === lic.id ? { ...l, status: updatedStatus } : l))
    );
    if (updatedStatus === 'Suspended') {
      toast.warning(`License ${lic.licenseKey} suspended.`);
    } else {
      toast.success(`License ${lic.licenseKey} reactivated.`);
    }
  };

  // Action: Revoke
  const handleRevokeLicense = (lic: LicenseItem) => {
    setLicenses((prev) =>
      prev.map((l) => (l.id === lic.id ? { ...l, status: 'Revoked' } : l))
    );
    toast.error(`License ${lic.licenseKey} revoked.`);
  };

  // Action: Extend
  const handleExtendLicense = (lic: LicenseItem) => {
    const updated = { ...lic, validTo: '31 Dec 2028', status: 'Active' as const };
    setLicenses((prev) => prev.map((l) => (l.id === lic.id ? updated : l)));
    toast.success(`License ${lic.licenseKey} extended until 31 Dec 2028.`);
  };

  const handleExport = () => {
    const headers = ['License Key', 'Customer/Tenant', 'Product', 'Plan', 'Users', 'Valid From', 'Valid To', 'Status'];
    const rows = filteredLicenses.map((l) => [
      l.licenseKey,
      l.customerTenant,
      l.product,
      l.planEdition,
      l.users,
      l.validFrom,
      l.validTo,
      l.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `License_Entitlements_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Licenses exported to CSV');
  };

  // Add Master Entitlement handler (Tab 2)
  const handleCreateMasterEntitlement = () => {
    if (!newEntitlementForm.name.trim()) {
      toast.error('Please enter entitlement feature name');
      return;
    }
    const newEnt: MasterEntitlement = {
      id: `ment-${Date.now()}`,
      code: newEntitlementForm.code.trim() || `ENT-${Date.now().toString().slice(-4)}`,
      name: newEntitlementForm.name,
      category: newEntitlementForm.category,
      product: newEntitlementForm.product,
      defaultQuota: newEntitlementForm.defaultQuota,
      quotaType: newEntitlementForm.quotaType,
      status: 'Active',
      activeTenants: 0,
      description: newEntitlementForm.description || 'Custom feature definition.',
    };
    setMasterEntitlements((prev) => [newEnt, ...prev]);
    setSelectedEntitlementId(newEnt.id);
    setIsNewEntitlementModalOpen(false);
    toast.success(`Entitlement definition "${newEnt.name}" registered!`);
  };

  // Save Manage Seats (Tab 3)
  const handleSaveManageSeats = () => {
    if (!editingAssignment) return;
    setAssignments((prev) =>
      prev.map((a) => (a.id === editingAssignment.id ? editingAssignment : a))
    );
    setIsManageSeatsModalOpen(false);
    toast.success(`Seat allocation for ${editingAssignment.tenantName} updated to ${editingAssignment.totalSeats} seats!`);
  };

  // Handle Resolve Compliance Alert (Tab 4)
  const handleResolveAlert = (alertId: string) => {
    setComplianceAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' } : a))
    );
    toast.success('Compliance issue marked as resolved.');
  };

  // Handle Grant Grace Period (Tab 4)
  const handleGrantGrace = (alertId: string) => {
    setComplianceAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Grace Period' } : a))
    );
    toast.info('7-Day grace period granted to tenant.');
  };

  // Handle Quick Renew / Extend (Tab 5)
  const handleQuickRenew = (ren: RenewalRecord) => {
    setRenewals((prev) =>
      prev.map((r) =>
        r.id === ren.id
          ? { ...r, renewalStatus: 'Auto-Renew Queued', daysRemaining: 365, expiryDate: '30 Nov 2027' }
          : r
      )
    );
    toast.success(`Renewal contract executed for ${ren.customerTenant}!`);
  };

  // Handle Bulk Renewal Notice (Tab 5)
  const handleBulkRenewalNotice = () => {
    toast.success('Automated renewal reminder invoices dispatched to all pending tenants!');
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push('/products/master')}>
          Product Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">License &amp; Entitlement Management</span>
      </div>

      {/* 2. HEADER MATCHING IMAGE 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            License &amp; Entitlement Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, assign, activate and manage product licenses, user entitlements and add-on access across tenants and plans.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenIssueModal}
          className="bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Issue License</span>
        </Button>
      </div>

      {/* 3. 4 STAT CARDS MATCHING IMAGE 2 EXACTLY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Licenses */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Key className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Licenses</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">2,480</h3>
          </div>
        </div>

        {/* Active Licenses */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Licenses</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">2,310</h3>
          </div>
        </div>

        {/* Expiring (30 Days) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/70 shrink-0">
            <Clock className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Expiring (30 Days)</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">94</h3>
          </div>
        </div>

        {/* Suspended / Revoked */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100/70 shrink-0">
            <Ban className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Suspended / Revoked</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">76</h3>
          </div>
        </div>
      </div>

      {/* 4. UNDERLINE TABS MATCHING IMAGE 2 */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          {[
            { id: 'licenses', label: 'Licenses' },
            { id: 'entitlements', label: 'Entitlements' },
            { id: 'assignments', label: 'Assignments' },
            { id: 'compliance', label: 'Usage & Compliance' },
            { id: 'renewals', label: 'Renewals' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'pb-3 font-semibold transition-all relative cursor-pointer',
                activeTab === tab.id
                  ? 'text-[#6366f1] border-b-2 border-[#6366f1] -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ==============================================================
          TAB 1: LICENSES (EXACT SCREENSHOT LAYOUT)
         ============================================================== */}
      {activeTab === 'licenses' && (
        <div className="space-y-4">
          {/* 5. FILTER BAR */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 max-w-3xl">
                {/* Product */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Product</label>
                  <div className="relative">
                    <select
                      value={filterProduct}
                      onChange={(e) => setFilterProduct(e.target.value)}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
                    >
                      <option value="All Products">All Products</option>
                      <option value="Pegatto CRM">Pegatto CRM</option>
                      <option value="Pegatto Education">Pegatto Education</option>
                      <option value="Pegatto IT">Pegatto IT</option>
                      <option value="Pegatto People">Pegatto People</option>
                      <option value="Pegatto Retail">Pegatto Retail</option>
                      <option value="Pegatto Real Estate">Pegatto Real Estate</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Plan / Edition */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Plan / Edition</label>
                  <div className="relative">
                    <select
                      value={filterPlan}
                      onChange={(e) => setFilterPlan(e.target.value)}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
                    >
                      <option value="All Plans">All Plans</option>
                      <option value="Standard">Standard</option>
                      <option value="Professional">Professional</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* License Status */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">License Status</label>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
                    >
                      <option value="All Status">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Expiring">Expiring</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Revoked">Revoked</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Tenant / Customer */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Tenant / Customer</label>
                  <div className="relative">
                    <select
                      value={filterTenant}
                      onChange={(e) => setFilterTenant(e.target.value)}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
                    >
                      <option value="All Tenants">All Tenants</option>
                      <option value="Euro Textiles">Euro Textiles</option>
                      <option value="Sunrise School">Sunrise School</option>
                      <option value="Prodian Infotech">Prodian Infotech</option>
                      <option value="Apex Solutions">Apex Solutions</option>
                      <option value="Indra Store">Indra Store</option>
                      <option value="City Builders">City Builders</option>
                      <option value="Style Union">Style Union</option>
                      <option value="Delta Academy">Delta Academy</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setFilterProduct('All Products');
                    setFilterPlan('All Plans');
                    setFilterStatus('All Status');
                    setFilterTenant('All Tenants');
                    setSearchQuery('');
                    toast.info('Filters reset');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <Button
                  type="button"
                  onClick={() => toast.success('License filters applied')}
                  className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs h-9 px-4 rounded-lg font-medium shadow-2xs"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* 6. TWO-COLUMN LAYOUT: TABLE (LEFT) & DETAILS (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT COLUMN: TABLE (7 COLS) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by license key, customer, or tenant..."
                    className="pl-9 h-9 text-xs rounded-xl border-slate-200/90 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleExport}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    <span>Export</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info('Configuring columns')}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                    <span>Columns</span>
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                        <th className="py-3 px-3 w-8 text-center">
                          <input type="checkbox" className="rounded border-slate-300 accent-[#6366f1] text-[#6366f1] h-3.5 w-3.5" />
                        </th>
                        <th className="py-3 px-3 font-semibold text-slate-800">License Key</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Customer / Tenant</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Product</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Plan / Edition</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Users</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Valid From</th>
                        <th className="py-3 px-3 font-semibold text-slate-800">Valid To</th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLicenses.map((lic) => {
                        const isSelected = selectedLicenseId === lic.id;
                        return (
                          <tr
                            key={lic.id}
                            onClick={() => setSelectedLicenseId(lic.id)}
                            className={cn(
                              'transition-colors cursor-pointer',
                              isSelected
                                ? 'bg-[#f8f5ff] border-l-2 border-l-[#6366f1]'
                                : 'hover:bg-slate-50/70'
                            )}
                          >
                            <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => setSelectedLicenseId(lic.id)}
                                className="rounded border-slate-300 accent-[#6366f1] text-[#6366f1] h-3.5 w-3.5 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-[#6366f1] underline decoration-[#6366f1]/40 whitespace-nowrap">
                              {lic.licenseKey}
                            </td>
                            <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                              {lic.customerTenant}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className={cn('px-2 py-0.5 rounded-md font-medium text-[10px]', lic.productColor)}>
                                {lic.product}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                              {lic.planEdition}
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                              {lic.users}
                            </td>
                            <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                              {lic.validFrom}
                            </td>
                            <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                              {lic.validTo}
                            </td>
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span
                                className={cn(
                                  'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                                  lic.status === 'Active'
                                    ? 'bg-[#dcfce7] text-[#15803d]'
                                    : lic.status === 'Expiring'
                                    ? 'bg-[#fef9c3] text-[#a16207]'
                                    : 'bg-[#fee2e2] text-[#b91c1c]'
                                )}
                              >
                                {lic.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(lic)}
                                  className="p-1 rounded text-slate-400 hover:text-[#6366f1] hover:bg-slate-100 cursor-pointer"
                                  title="Edit License"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toast.info(`Options for ${lic.licenseKey}`)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                                  title="More"
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
                  <div>Showing 1-{filteredLicenses.length} of 2,480 licenses</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span>Rows per page:</span>
                      <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">«</button>
                      <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&lt;</button>
                      <button type="button" className="h-6 w-6 rounded bg-[#6366f1] text-white font-semibold text-xs flex items-center justify-center shadow-xs">1</button>
                      <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">2</button>
                      <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">3</button>
                      <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">4</button>
                      <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">5</button>
                      <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&gt;</button>
                      <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">»</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LICENSE DETAILS (5 COLS) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">License Details</h3>
                  <span
                    className={cn(
                      'text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
                      selectedLicense.status === 'Active'
                        ? 'bg-[#dcfce7] text-[#15803d]'
                        : selectedLicense.status === 'Expiring'
                        ? 'bg-[#fef9c3] text-[#a16207]'
                        : 'bg-[#fee2e2] text-[#b91c1c]'
                    )}
                  >
                    {selectedLicense.status}
                  </span>
                </div>

                {/* Banner */}
                <div className="flex items-start gap-3 pt-1">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
                    <Key className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-mono">
                      {selectedLicense.licenseKey}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {selectedLicense.product} &gt; {selectedLicense.planEdition}
                    </p>
                  </div>
                </div>

                {/* Key-Value metadata */}
                <div className="space-y-2.5 text-xs pt-1">
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Customer / Tenant</span>
                    <span className="font-semibold text-slate-800">{selectedLicense.customerTenant}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">License Type</span>
                    <span className="font-semibold text-slate-800">Subscription</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Users (Entitled)</span>
                    <span className="font-semibold text-slate-800">{selectedLicense.users}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Validity</span>
                    <span className="font-mono text-slate-800">{selectedLicense.validFrom} – {selectedLicense.validTo}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Activated On</span>
                    <span className="font-mono text-slate-800">{selectedLicense.activatedOn}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Last Activity</span>
                    <span className="text-slate-700">{selectedLicense.lastActivity}</span>
                  </div>
                </div>

                {/* Entitlements (Features & Add-ons) */}
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs">Entitlements (Features &amp; Add-ons)</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                          <th className="py-2 px-2.5">Entitlement</th>
                          <th className="py-2 px-2 text-center">Status</th>
                          <th className="py-2 px-2.5 text-right">Qty / Limit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedLicense.entitlements.map((ent, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2 px-2.5 font-medium text-slate-800 flex items-center gap-1.5">
                              {ent.status === 'Enabled' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              )}
                              <span>{ent.feature}</span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                                  ent.status === 'Enabled'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                )}
                              >
                                {ent.status}
                              </span>
                            </td>
                            <td className="py-2 px-2.5 text-right font-medium text-slate-700">
                              {ent.quota}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSuspendLicense(selectedLicense)}
                    className="text-xs h-9 px-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {selectedLicense.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRevokeLicense(selectedLicense)}
                    className="text-xs h-9 px-2 text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer"
                  >
                    Revoke
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleExtendLicense(selectedLicense)}
                    className="text-xs h-9 px-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Extend
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleOpenEditModal(selectedLicense)}
                    className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs h-9 px-2 font-semibold shadow-xs cursor-pointer"
                  >
                    Edit Entitlements
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 2: ENTITLEMENTS (MASTER CATALOG & CAPABILITY MAPPING)
         ============================================================== */}
      {activeTab === 'entitlements' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top Bar for Entitlements */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl border border-purple-100/70">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Product Entitlements Catalog</h3>
                <p className="text-xs text-slate-500">
                  Master definition of platform capabilities, quotas, and feature flags bundled into licenses.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={entitlementFilterCategory}
                onChange={(e) => setEntitlementFilterCategory(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value="All Categories">All Categories</option>
                <option value="Base Platform">Base Platform</option>
                <option value="Intelligence">Intelligence (AI)</option>
                <option value="Communication">Communication</option>
                <option value="Reporting">Reporting</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
              <Button
                type="button"
                onClick={() => setIsNewEntitlementModalOpen(true)}
                className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs h-9 px-3.5 rounded-xl font-semibold gap-1.5 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>New Entitlement</span>
              </Button>
            </div>
          </div>

          {/* 2-Column Split: Catalog Table & Detail Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Entitlements Table */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                      <th className="py-3 px-3.5">Code</th>
                      <th className="py-3 px-3.5">Entitlement Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Product</th>
                      <th className="py-3 px-3">Default Quota</th>
                      <th className="py-3 px-3 text-center">Tenants Using</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {masterEntitlements
                      .filter((m) =>
                        entitlementFilterCategory === 'All Categories'
                          ? true
                          : m.category === entitlementFilterCategory
                      )
                      .map((item) => {
                        const isSelected = selectedEntitlementId === item.id;
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedEntitlementId(item.id)}
                            className={cn(
                              'cursor-pointer transition-colors',
                              isSelected
                                ? 'bg-[#f8f5ff] border-l-2 border-l-[#6366f1]'
                                : 'hover:bg-slate-50/70'
                            )}
                          >
                            <td className="py-3 px-3.5 font-mono font-semibold text-[#6366f1]">
                              {item.code}
                            </td>
                            <td className="py-3 px-3.5 font-semibold text-slate-900">
                              {item.name}
                            </td>
                            <td className="py-3 px-3">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-medium">{item.product}</td>
                            <td className="py-3 px-3 font-semibold text-slate-800">{item.defaultQuota}</td>
                            <td className="py-3 px-3 text-center font-semibold text-slate-900">
                              {item.activeTenants}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Selected Entitlement Details Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-[#6366f1] uppercase tracking-wider">
                  Entitlement Specification
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  {selectedMasterEntitlement.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {selectedMasterEntitlement.name}
                </h4>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {selectedMasterEntitlement.code}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {selectedMasterEntitlement.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{selectedMasterEntitlement.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Product Scope:</span>
                  <span className="font-semibold text-slate-800">{selectedMasterEntitlement.product}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Quota Type:</span>
                  <span className="font-semibold text-slate-800">{selectedMasterEntitlement.quotaType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Default Allocation:</span>
                  <span className="font-semibold text-slate-800">{selectedMasterEntitlement.defaultQuota}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Active Tenant Attachments:</span>
                  <span className="font-bold text-[#6366f1]">{selectedMasterEntitlement.activeTenants} tenants</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.info(`Editing blueprint for ${selectedMasterEntitlement.code}`)}
                  className="flex-1 text-xs h-8.5 border-slate-200"
                >
                  Edit Definition
                </Button>
                <Button
                  type="button"
                  onClick={() => toast.success(`Feature flags synced across ${selectedMasterEntitlement.activeTenants} tenants!`)}
                  className="flex-1 bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs h-8.5 font-semibold"
                >
                  Sync Feature Flags
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 3: ASSIGNMENTS (TENANT SEAT UTILIZATION & CAPACITY)
         ============================================================== */}
      {activeTab === 'assignments' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top KPI Cards for Assignments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Allocated Seats</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">2,180 <span className="text-xs text-slate-400 font-normal">/ 2,480</span></p>
              </div>
              <div className="p-3 bg-purple-50 text-[#6366f1] rounded-xl">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Available Float Seats</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">300</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Full Capacity (100%)</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">42 Tenants</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Over-allocated Alerts</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">1 Tenant</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Assignments Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={assignmentSearch}
                  onChange={(e) => setAssignmentSearch(e.target.value)}
                  placeholder="Filter tenant assignments..."
                  className="pl-9 h-9 text-xs rounded-xl bg-slate-50/70 border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success('Assignments exported to CSV')}
                  className="text-xs border-slate-200 hover:bg-slate-50 gap-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  Export Allocations
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Tenant / Organization</th>
                    <th className="py-3 px-3">Product &amp; Edition</th>
                    <th className="py-3 px-3">License Key</th>
                    <th className="py-3 px-4">Seat Utilization</th>
                    <th className="py-3 px-3 text-center">Available</th>
                    <th className="py-3 px-3">Last Assignment</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments
                    .filter((a) =>
                      a.tenantName.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
                      a.licenseKey.toLowerCase().includes(assignmentSearch.toLowerCase())
                    )
                    .map((asgn) => {
                      const percentage = Math.round((asgn.activeSeats / asgn.totalSeats) * 100);
                      const isOver = asgn.activeSeats > asgn.totalSeats;

                      return (
                        <tr key={asgn.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {asgn.tenantName}
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-medium">
                            {asgn.product} <span className="text-slate-400">({asgn.planEdition})</span>
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-[#6366f1]">
                            {asgn.licenseKey}
                          </td>
                          <td className="py-3 px-4 min-w-[160px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold">
                                <span className={isOver ? 'text-rose-600' : 'text-slate-700'}>
                                  {asgn.activeSeats} / {asgn.totalSeats} seats
                                </span>
                                <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                                  {percentage}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all',
                                    isOver
                                      ? 'bg-rose-500'
                                      : percentage >= 90
                                      ? 'bg-amber-500'
                                      : 'bg-[#6366f1]'
                                  )}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-800">
                            {Math.max(0, asgn.totalSeats - asgn.activeSeats)}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                            {asgn.lastAssigned}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {isOver ? (
                              <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-rose-200">
                                Overallocated
                              </span>
                            ) : percentage >= 95 ? (
                              <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-amber-200">
                                Saturated
                              </span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-200">
                                Healthy
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingAssignment({ ...asgn });
                                setIsManageSeatsModalOpen(true);
                              }}
                              className="text-xs h-7 px-2.5 border-slate-200 hover:border-[#6366f1] text-[#6366f1]"
                            >
                              Manage Seats
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 4: USAGE & COMPLIANCE (AUDIT & POLICY ENGINE)
         ============================================================== */}
      {activeTab === 'compliance' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top Compliance Health Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0">
                <Shield className="h-6 w-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">License Compliance Health</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    98.4% Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated telemetry checks verify seat quotas, token integrity, and feature flag licensing every 15 minutes.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => toast.success('Telemetry audit scan triggered across 2,480 licenses!')}
              className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs h-9 px-4 rounded-xl font-semibold gap-1.5 shadow-xs cursor-pointer self-start md:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Run Telemetry Scan</span>
            </Button>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Compliant Deployments</span>
              <p className="text-2xl font-bold text-emerald-600">2,310</p>
              <p className="text-[11px] text-slate-400">Zero policy violations</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Over-Quota Warnings</span>
              <p className="text-2xl font-bold text-amber-600">3</p>
              <p className="text-[11px] text-slate-400">Soft warning threshold exceeded</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Critical Breaches</span>
              <p className="text-2xl font-bold text-rose-600">1</p>
              <p className="text-[11px] text-slate-400">Strict throttle action pending</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Peak Concurrent Online</span>
              <p className="text-2xl font-bold text-slate-900">14,250</p>
              <p className="text-[11px] text-slate-400">Active token sessions</p>
            </div>
          </div>

          {/* Compliance Alerts Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Active Compliance &amp; Throttle Incidents</h4>
                <p className="text-xs text-slate-500">Detected overages and token validation warnings requiring action.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-3">Tenant / License</th>
                    <th className="py-3 px-4">Issue Description</th>
                    <th className="py-3 px-3">Detected At</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complianceAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                            alert.severity === 'Critical'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : alert.severity === 'Warning'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          )}
                        >
                          {alert.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{alert.tenantName}</p>
                        <p className="font-mono text-[11px] text-[#6366f1]">{alert.licenseKey}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{alert.issue}</p>
                        <p className="text-[11px] text-slate-500">{alert.details}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {alert.detectedAt}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                            alert.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : alert.status === 'Grace Period'
                              ? 'bg-purple-50 text-[#6366f1]'
                              : 'bg-amber-50 text-amber-700'
                          )}
                        >
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {alert.status !== 'Grace Period' && alert.status !== 'Resolved' && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleGrantGrace(alert.id)}
                              className="text-xs h-7 px-2 border-slate-200 text-slate-700"
                            >
                              +7d Grace
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                            className="text-xs h-7 px-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          >
                            Resolve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 5: RENEWALS (EXPIRATION PIPELINE & AUTO-INVOICING)
         ============================================================== */}
      {activeTab === 'renewals' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top KPI Cards for Renewals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Expiring &lt; 7 Days</span>
              <p className="text-2xl font-bold text-rose-600">18</p>
              <p className="text-[11px] text-slate-400">Immediate notice queue</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Expiring in 30 Days</span>
              <p className="text-2xl font-bold text-amber-600">94</p>
              <p className="text-[11px] text-slate-400">Standard renewal window</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Auto-Renew Active</span>
              <p className="text-2xl font-bold text-emerald-600">1,840</p>
              <p className="text-[11px] text-slate-400">79% recurring retention</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Renewal Pipeline ARR</span>
              <p className="text-2xl font-bold text-[#6366f1]">₹86.4 Lakhs</p>
              <p className="text-[11px] text-slate-400">Projected this quarter</p>
            </div>
          </div>

          {/* Renewals Table & Batch Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Upcoming Expirations ({renewals.length})</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleBulkRenewalNotice}
                  className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs h-8.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Renewal Reminders</span>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">License Key</th>
                    <th className="py-3 px-4">Customer / Tenant</th>
                    <th className="py-3 px-3">Product &amp; Edition</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3">Days Left</th>
                    <th className="py-3 px-3">Contract (ARR)</th>
                    <th className="py-3 px-3 text-center">Auto-Renew</th>
                    <th className="py-3 px-3 text-center">Renewal Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {renewals.map((ren) => (
                    <tr key={ren.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-semibold text-[#6366f1]">
                        {ren.licenseKey}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {ren.customerTenant}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {ren.product} ({ren.planEdition})
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {ren.expiryDate}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold',
                            ren.daysRemaining <= 7
                              ? 'bg-rose-50 text-rose-700'
                              : ren.daysRemaining <= 15
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          )}
                        >
                          {ren.daysRemaining} days left
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {ren.contractValue}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'text-[11px] font-semibold',
                            ren.autoRenew ? 'text-emerald-600' : 'text-slate-400'
                          )}
                        >
                          {ren.autoRenew ? 'Enabled' : 'Manual'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                            ren.renewalStatus === 'Auto-Renew Queued'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ren.renewalStatus === 'Payment Failed'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          )}
                        >
                          {ren.renewalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info(`Renewal notice emailed to ${ren.customerTenant}`)}
                            className="text-xs h-7 px-2 border-slate-200 text-slate-700"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Notice
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleQuickRenew(ren)}
                            className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs h-7 px-2.5 font-semibold"
                          >
                            Renew (+1 Yr)
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL 1: ISSUE LICENSE DIALOG (PORTAL STANDARD FORMAT)
         ============================================================== */}
      <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl border border-purple-100/70">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  Issue New Product License
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Generate a validated license key and assign feature entitlements to a tenant.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Customer & Product Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Customer / Tenant Name *</label>
                <Input
                  value={newLicenseForm.customerTenant}
                  onChange={(e) =>
                    setNewLicenseForm({ ...newLicenseForm, customerTenant: e.target.value })
                  }
                  className="text-xs h-9 rounded-lg"
                  placeholder="e.g. Acme Corporation"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product *</label>
                <select
                  value={newLicenseForm.product}
                  onChange={(e) =>
                    setNewLicenseForm({ ...newLicenseForm, product: e.target.value })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800"
                >
                  <option value="Pegatto CRM">Pegatto CRM</option>
                  <option value="Pegatto Education">Pegatto Education</option>
                  <option value="Pegatto IT">Pegatto IT</option>
                  <option value="Pegatto People">Pegatto People</option>
                  <option value="Pegatto Retail">Pegatto Retail</option>
                  <option value="Pegatto Real Estate">Pegatto Real Estate</option>
                </select>
              </div>
            </div>

            {/* Plan, Seats & License Type Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Plan / Edition</label>
                <select
                  value={newLicenseForm.planEdition}
                  onChange={(e) =>
                    setNewLicenseForm({ ...newLicenseForm, planEdition: e.target.value })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800"
                >
                  <option value="Standard">Standard</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Users (Seats)</label>
                <Input
                  type="number"
                  value={newLicenseForm.users}
                  onChange={(e) =>
                    setNewLicenseForm({ ...newLicenseForm, users: Number(e.target.value) })
                  }
                  className="text-xs h-9 rounded-lg"
                  placeholder="e.g. 50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">License Type</label>
                <select
                  value={newLicenseForm.licenseType}
                  onChange={(e) =>
                    setNewLicenseForm({ ...newLicenseForm, licenseType: e.target.value })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800"
                >
                  <option value="Subscription">Subscription</option>
                  <option value="Perpetual">Perpetual</option>
                  <option value="Trial (14 Days)">Trial (14 Days)</option>
                </select>
              </div>
            </div>

            {/* Validity Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Valid From</label>
                <Input
                  value={newLicenseForm.validFrom}
                  onChange={(e) =>
                    setNewLicenseForm({ ...newLicenseForm, validFrom: e.target.value })
                  }
                  className="text-xs h-9 rounded-lg font-mono"
                  placeholder="DD Mon YYYY"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Valid To</label>
                <Input
                  value={newLicenseForm.validTo}
                  onChange={(e) =>
                    setNewLicenseForm({ ...newLicenseForm, validTo: e.target.value })
                  }
                  className="text-xs h-9 rounded-lg font-mono"
                  placeholder="DD Mon YYYY"
                />
              </div>
            </div>

            {/* Entitlements Checklist */}
            <div className="space-y-2 pt-1">
              <label className="font-semibold text-slate-700 block">
                Features &amp; Module Entitlements
              </label>
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                {newLicenseForm.entitlements.map((ent, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                      <input
                        type="checkbox"
                        checked={ent.status === 'Enabled'}
                        onChange={(e) => {
                          const updated = [...newLicenseForm.entitlements];
                          updated[idx] = {
                            ...ent,
                            status: e.target.checked ? 'Enabled' : 'Disabled',
                          };
                          setNewLicenseForm({ ...newLicenseForm, entitlements: updated });
                        }}
                        className="rounded border-slate-300 accent-[#6366f1] text-[#6366f1] h-3.5 w-3.5"
                      />
                      <span>{ent.feature}</span>
                    </label>
                    <Input
                      value={ent.quota}
                      onChange={(e) => {
                        const updated = [...newLicenseForm.entitlements];
                        updated[idx] = { ...ent, quota: e.target.value };
                        setNewLicenseForm({ ...newLicenseForm, entitlements: updated });
                      }}
                      className="h-7 w-32 text-[11px] bg-white text-right"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Key Preview */}
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase">License Key Format</span>
                <p className="font-mono font-bold text-slate-900 text-xs">
                  {newLicenseForm.product === 'Pegatto Education' ? 'PGT-EDU-1004XX' :
                   newLicenseForm.product === 'Pegatto IT' ? 'PGT-IT-1004XX' :
                   newLicenseForm.product === 'Pegatto People' ? 'PGT-PEO-1004XX' :
                   newLicenseForm.product === 'Pegatto Retail' ? 'PGT-RTL-1004XX' : 'PGT-CRM-1004XX'}
                </p>
              </div>
              <span className="text-[11px] text-purple-800 font-semibold bg-white px-2.5 py-1 rounded-md border border-purple-200">
                Auto-assigned on create
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsIssueModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateLicense}
              className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold px-4 cursor-pointer"
            >
              Issue License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==============================================================
          MODAL 2: EDIT ENTITLEMENTS DIALOG (PORTAL STANDARD FORMAT)
         ============================================================== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl border border-purple-100/70">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  Edit Entitlements: {editingLicense?.licenseKey}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Update customer seat allocations, feature entitlements, status, and validity period.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {editingLicense && (
            <div className="space-y-4 py-2 text-xs">
              {/* Tenant & Status Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Customer / Tenant</label>
                  <Input
                    value={editingLicense.customerTenant}
                    onChange={(e) =>
                      setEditingLicense({ ...editingLicense, customerTenant: e.target.value })
                    }
                    className="text-xs h-9 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">License Status</label>
                  <select
                    value={editingLicense.status}
                    onChange={(e) =>
                      setEditingLicense({ ...editingLicense, status: e.target.value as any })
                    }
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Expiring">Expiring</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Revoked">Revoked</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Users (Seats)</label>
                  <Input
                    type="number"
                    value={editingLicense.users}
                    onChange={(e) =>
                      setEditingLicense({ ...editingLicense, users: Number(e.target.value) })
                    }
                    className="text-xs h-9 rounded-lg font-semibold"
                  />
                </div>
              </div>

              {/* Validity Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Valid From</label>
                  <Input
                    value={editingLicense.validFrom}
                    onChange={(e) =>
                      setEditingLicense({ ...editingLicense, validFrom: e.target.value })
                    }
                    className="text-xs h-9 rounded-lg font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Valid To (Expiration)</label>
                  <Input
                    value={editingLicense.validTo}
                    onChange={(e) =>
                      setEditingLicense({ ...editingLicense, validTo: e.target.value })
                    }
                    className="text-xs h-9 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Editable Entitlements List */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Feature Entitlements</label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...editingLicense.entitlements,
                        { feature: 'New Custom Add-on', status: 'Enabled' as const, quota: 'Included' },
                      ];
                      setEditingLicense({ ...editingLicense, entitlements: updated });
                    }}
                    className="text-[11px] font-semibold text-[#6366f1] hover:underline cursor-pointer"
                  >
                    + Add Entitlement
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Feature Name</th>
                        <th className="py-2 px-3 text-center">Status</th>
                        <th className="py-2 px-3 text-right">Quota / Allocation</th>
                        <th className="py-2 px-2 text-center w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editingLicense.entitlements.map((ent, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3">
                            <Input
                              value={ent.feature}
                              onChange={(e) => {
                                const updated = [...editingLicense.entitlements];
                                updated[idx] = { ...ent, feature: e.target.value };
                                setEditingLicense({ ...editingLicense, entitlements: updated });
                              }}
                              className="h-7 text-xs bg-transparent border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <select
                              value={ent.status}
                              onChange={(e) => {
                                const updated = [...editingLicense.entitlements];
                                updated[idx] = { ...ent, status: e.target.value as any };
                                setEditingLicense({ ...editingLicense, entitlements: updated });
                              }}
                              className="h-7 text-xs rounded border border-slate-200 px-2 font-semibold"
                            >
                              <option value="Enabled">Enabled</option>
                              <option value="Disabled">Disabled</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <Input
                              value={ent.quota}
                              onChange={(e) => {
                                const updated = [...editingLicense.entitlements];
                                updated[idx] = { ...ent, quota: e.target.value };
                                setEditingLicense({ ...editingLicense, entitlements: updated });
                              }}
                              className="h-7 w-28 ml-auto text-xs text-right"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingLicense.entitlements.filter((_, i) => i !== idx);
                                setEditingLicense({ ...editingLicense, entitlements: updated });
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEditLicense}
              className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold px-4 cursor-pointer"
            >
              Save Entitlements
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==============================================================
          MODAL 3: NEW MASTER ENTITLEMENT MODAL (FOR TAB 2)
         ============================================================== */}
      <Dialog open={isNewEntitlementModalOpen} onOpenChange={setIsNewEntitlementModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="pb-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl border border-purple-100/70">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Register Master Entitlement
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Create a new platform feature capability to attach to licenses.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Entitlement Code *</label>
              <Input
                value={newEntitlementForm.code}
                onChange={(e) =>
                  setNewEntitlementForm({ ...newEntitlementForm, code: e.target.value })
                }
                className="text-xs h-9 font-mono"
                placeholder="e.g. ENT-AI-AGENT"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Feature Name *</label>
              <Input
                value={newEntitlementForm.name}
                onChange={(e) =>
                  setNewEntitlementForm({ ...newEntitlementForm, name: e.target.value })
                }
                className="text-xs h-9"
                placeholder="e.g. AI Customer Agent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category</label>
                <select
                  value={newEntitlementForm.category}
                  onChange={(e) =>
                    setNewEntitlementForm({ ...newEntitlementForm, category: e.target.value as any })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="Base Platform">Base Platform</option>
                  <option value="Intelligence">Intelligence</option>
                  <option value="Communication">Communication</option>
                  <option value="Reporting">Reporting</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Security">Security</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Quota Type</label>
                <select
                  value={newEntitlementForm.quotaType}
                  onChange={(e) =>
                    setNewEntitlementForm({ ...newEntitlementForm, quotaType: e.target.value as any })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="Unlimited">Unlimited</option>
                  <option value="Per Seat">Per Seat</option>
                  <option value="Per Integration">Per Integration</option>
                  <option value="Storage">Storage Bucket</option>
                  <option value="Enterprise">Enterprise Flag</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Default Allocation / Quota</label>
              <Input
                value={newEntitlementForm.defaultQuota}
                onChange={(e) =>
                  setNewEntitlementForm({ ...newEntitlementForm, defaultQuota: e.target.value })
                }
                className="text-xs h-9"
                placeholder="e.g. 50 Users or Included"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Description</label>
              <Input
                value={newEntitlementForm.description}
                onChange={(e) =>
                  setNewEntitlementForm({ ...newEntitlementForm, description: e.target.value })
                }
                className="text-xs h-9"
                placeholder="Summary of capability and permissions granted"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewEntitlementModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateMasterEntitlement}
              className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold px-4"
            >
              Register Entitlement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==============================================================
          MODAL 4: MANAGE SEATS MODAL (FOR TAB 3)
         ============================================================== */}
      <Dialog open={isManageSeatsModalOpen} onOpenChange={setIsManageSeatsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="pb-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl border border-purple-100/70">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Manage Seat Capacity
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  {editingAssignment?.tenantName} &bull; {editingAssignment?.product}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {editingAssignment && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500">Currently Claimed</span>
                  <p className="text-lg font-bold text-slate-900">{editingAssignment.activeSeats} Seats</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Total Allocation</span>
                  <p className="text-lg font-bold text-[#6366f1]">{editingAssignment.totalSeats} Seats</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">New Total Seat Allocation</label>
                <Input
                  type="number"
                  value={editingAssignment.totalSeats}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      totalSeats: Number(e.target.value),
                      overAllocated: editingAssignment.activeSeats > Number(e.target.value),
                    })
                  }
                  className="text-xs h-9 font-bold"
                />
                <p className="text-[11px] text-slate-500">
                  Increases or decreases available user licenses on the tenant&apos;s authentication directory.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsManageSeatsModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveManageSeats}
              className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold px-4"
            >
              Save Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
