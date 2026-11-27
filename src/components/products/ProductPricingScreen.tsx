'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import {
  useGetProductPricingListQuery,
  useGetProductPricingKpiQuery,
  useGetProductPriceMatrixQuery,
  useGetProductPriceHistoryQuery,
  useGetProductMasterLookupsQuery,
  useGetProductEditionLookupsQuery,
  useGetPlanLookupsQuery,
  useCreateProductPricingMutation,
  useUpdateProductPricingMutation,
  useDeleteProductPricingMutation,
  useBulkUpdateProductPricingMutation,
  useScheduleProductPricingMutation,
  downloadProductPricingExportCsv,
} from '@/service/api/superAdminService';

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
  backendId?: number;
  pricingId: string;
  productId?: number | null;
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

const CURRENCY_DISPLAY_MAP: Record<string, string> = {
  INR: 'INR (₹)',
  USD: 'USD ($)',
  EUR: 'EUR (€)',
  GBP: 'GBP (£)',
};

const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const COUNTRY_OPTIONS: Array<{ name: string; code: string; currency?: string }> = [
  { name: 'Global', code: 'GL', currency: 'USD ($)' },
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Andorra', code: 'AD', currency: 'EUR (€)' },
  { name: 'Angola', code: 'AO' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU', currency: 'USD ($)' },
  { name: 'Austria', code: 'AT', currency: 'EUR (€)' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE', currency: 'EUR (€)' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Brunei', code: 'BN' },
  { name: 'Bulgaria', code: 'BG', currency: 'EUR (€)' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA', currency: 'USD ($)' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Croatia', code: 'HR', currency: 'EUR (€)' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY', currency: 'EUR (€)' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE', currency: 'EUR (€)' },
  { name: 'Eswatini', code: 'SZ' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI', currency: 'EUR (€)' },
  { name: 'France', code: 'FR', currency: 'EUR (€)' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE', currency: 'EUR (€)' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR', currency: 'EUR (€)' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN', currency: 'INR (₹)' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE', currency: 'EUR (€)' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT', currency: 'EUR (€)' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Laos', code: 'LA' },
  { name: 'Latvia', code: 'LV', currency: 'EUR (€)' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT', currency: 'EUR (€)' },
  { name: 'Luxembourg', code: 'LU', currency: 'EUR (€)' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT', currency: 'EUR (€)' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia', code: 'FM' },
  { name: 'Moldova', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montenegro', code: 'ME' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL', currency: 'EUR (€)' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'North Korea', code: 'KP' },
  { name: 'North Macedonia', code: 'MK' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestine', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT', currency: 'EUR (€)' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russia', code: 'RU' },
  { name: 'Rwanda', code: 'RW' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK', currency: 'EUR (€)' },
  { name: 'Slovenia', code: 'SI', currency: 'EUR (€)' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Korea', code: 'KR' },
  { name: 'South Sudan', code: 'SS' },
  { name: 'Spain', code: 'ES', currency: 'EUR (€)' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syria', code: 'SY' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP (£)' },
  { name: 'United States', code: 'US', currency: 'USD ($)' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Vatican City', code: 'VA' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
];

const COUNTRY_CODE_MAP: Record<string, string> = Object.fromEntries(
  COUNTRY_OPTIONS.map((c) => [c.name, c.code])
);

function mapBackendPricingToRule(row: any): PricingRule {
  const curCode = String(row.Currency || 'INR').split(' ')[0].toUpperCase();
  const sym = row.Currency_Symbol || CURRENCY_SYMBOL_MAP[curCode] || '₹';
  const numPrice = Number(row.Price ?? 0);
  const app = (row.Applicability && typeof row.Applicability === 'object' ? row.Applicability : {}) as Record<string, any>;
  const country = row.Country || 'India';
  const rawCycle = String(row.Billing_Cycle || 'Monthly');
  const cycle: PricingRule['billingCycle'] =
    rawCycle.toLowerCase().includes('ann')
      ? 'Annual'
      : rawCycle.toLowerCase().includes('quart')
      ? 'Quarterly'
      : 'Monthly';
  const rawStatus = String(row.Status || 'Active');
  const status: PricingRule['status'] =
    rawStatus === 'Scheduled' || rawStatus === 'Expired' || rawStatus === 'Draft' ? rawStatus : 'Active';

  return {
    id: String(row.id),
    backendId: Number(row.id),
    pricingId: row.Pricing_Id || `PRC-${row.id}`,
    productId: row.Product_Id ?? null,
    product: row.Product_Name || 'Pegatto CRM',
    edition: row.Edition_Name || app.edition_label || 'Standard',
    plan: row.Plan_Name || app.plan_label || 'Standard',
    country,
    countryCode: COUNTRY_CODE_MAP[country] || 'GL',
    currency: CURRENCY_DISPLAY_MAP[curCode] || curCode,
    price: `${sym}${numPrice.toLocaleString('en-IN')}`,
    priceNumeric: numPrice,
    billingCycle: cycle,
    effectiveFrom: row.Effective_From || '—',
    effectiveTo: row.Effective_To || '—',
    taxTreatment: row.Tax_Treatment || 'Exclusive of Tax',
    licenseUnit: row.Pricing_Model || 'Per Tenant',
    minQuantity: Number(app.min_quantity || 1),
    status,
    tiers: Array.isArray(row.Configured_Tiers) ? row.Configured_Tiers : [],
    applicableSegments: Array.isArray(app.segments) ? app.segments : [],
    allowDiscounts: app.allow_discounts !== false,
    allowCustomization: app.allow_customization !== false,
    hsnCode: row.HSN_SAC_Code || '',
    taxRate: row.Tax_Label || (row.Tax_Rate !== null && row.Tax_Rate !== undefined ? `${row.Tax_Rate}%` : ''),
    invoicingNotes: row.Terms_And_Notes || '',
  };
}

function createEmptyRule(defaultProduct = 'Pegatto CRM', defaultProductId?: number | null): PricingRule {
  return {
    id: `prc-${Date.now()}`,
    pricingId: '',
    productId: defaultProductId ?? null,
    product: defaultProduct,
    edition: 'Professional',
    plan: 'Standard',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR (₹)',
    price: '',
    priceNumeric: 0,
    billingCycle: 'Monthly',
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: '',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Draft',
    tiers: [],
    applicableSegments: [],
    allowDiscounts: true,
    allowCustomization: true,
    hsnCode: '',
    taxRate: '',
    invoicingNotes: '',
  };
}

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

  // Selected Rule ID (for right panel inspection / edit)
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');

  // Multi-select row IDs for bulk actions
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Filters State
  const [filterProduct, setFilterProduct] = useState('All');
  const [filterEdition, setFilterEdition] = useState('All');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterCountry, setFilterCountry] = useState('All Countries');
  const [filterCurrency, setFilterCurrency] = useState('All Currencies');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Columns customizer & row options menu
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [openOptionsRowId, setOpenOptionsRowId] = useState<string | null>(null);
  const [visibleCols, setVisibleCols] = useState({
    pricingId: true,
    product: true,
    editionPlan: true,
    country: true,
    price: true,
    cycle: true,
    status: true,
  });

  // Bulk Update Form State
  const [bulkProduct, setBulkProduct] = useState('All');
  const [bulkCurrency, setBulkCurrency] = useState('All');
  const [bulkAdjType, setBulkAdjType] = useState('increase_pct');
  const [bulkAdjValue, setBulkAdjValue] = useState('5');
  const [bulkEffectiveDate, setBulkEffectiveDate] = useState('2026-07-01');
  const [bulkPreviewCount, setBulkPreviewCount] = useState<number | null>(null);

  // Right Panel State
  const [panelMode, setPanelMode] = useState<'view' | 'edit' | 'create'>(initialMode);
  const [rightSubTab, setRightSubTab] = useState<'overview' | 'details' | 'tiers' | 'applicability' | 'taxes'>(
    initialMode === 'create' ? 'details' : 'overview'
  );
  const [formData, setFormData] = useState<PricingRule>(() => createEmptyRule());

  // Pagination & Schedule Modal
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2026-06-01');
  const [newProposedPrice, setNewProposedPrice] = useState('₹5,499');
  const [scheduleLeadNote, setScheduleLeadNote] = useState('Notify tenants 30 days in advance');

  // Live Backend Queries
  const pricingQueryArgs = useMemo(
    () => ({
      Product: filterProduct !== 'All' ? filterProduct : undefined,
      Edition: filterEdition !== 'All' ? filterEdition : undefined,
      Plan: filterPlan !== 'All Plans' ? filterPlan : undefined,
      Country: filterCountry !== 'All Countries' ? filterCountry : undefined,
      Currency: filterCurrency !== 'All Currencies' ? filterCurrency : undefined,
      Status: filterStatus !== 'All' ? filterStatus : undefined,
      search: searchQuery.trim() || undefined,
    }),
    [filterProduct, filterEdition, filterPlan, filterCountry, filterCurrency, filterStatus, searchQuery]
  );

  const { data: rawPricingList = [], isFetching: isPricingFetching, refetch: refetchPricingList } =
    useGetProductPricingListQuery(pricingQueryArgs, { refetchOnMountOrArgChange: true });
  const { data: kpiData, refetch: refetchKpi } = useGetProductPricingKpiQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: matrixRows = [], isFetching: isMatrixFetching, refetch: refetchMatrix } =
    useGetProductPriceMatrixQuery(
      { Product: filterProduct !== 'All' ? filterProduct : undefined },
      { refetchOnMountOrArgChange: true }
    );
  const { data: historyRows = [], isFetching: isHistoryFetching, refetch: refetchHistory } =
    useGetProductPriceHistoryQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: productLookups = [] } = useGetProductMasterLookupsQuery();
  const selectedFormProduct = useMemo(
    () =>
      productLookups.find(
        (p: any) =>
          p.Product_Name === formData.product || String(p.id) === String(formData.product)
      ),
    [productLookups, formData.product]
  );
  const { data: editionLookups = [] } = useGetProductEditionLookupsQuery(
    selectedFormProduct?.id ? { Product_Id: selectedFormProduct.id } : undefined
  );
  const selectedFormEdition = useMemo(
    () =>
      editionLookups.find(
        (e: any) =>
          e.Edition_Name === formData.edition || String(e.id) === String(formData.edition)
      ),
    [editionLookups, formData.edition]
  );
  const { data: planLookups = [] } = useGetPlanLookupsQuery(
    selectedFormEdition?.id ? { Edition_Id: selectedFormEdition.id } : undefined
  );

  // Mutations
  const [createProductPricing, { isLoading: isCreatingPricing }] = useCreateProductPricingMutation();
  const [updateProductPricing, { isLoading: isUpdatingPricing }] = useUpdateProductPricingMutation();
  const [deleteProductPricing] = useDeleteProductPricingMutation();
  const [bulkUpdatePricing, { isLoading: isBulkUpdating }] = useBulkUpdateProductPricingMutation();
  const [scheduleProductPricing, { isLoading: isScheduling }] = useScheduleProductPricingMutation();

  const pricingRules: PricingRule[] = useMemo(
    () => rawPricingList.map(mapBackendPricingToRule),
    [rawPricingList]
  );

  const editionOptions = useMemo(() => {
    const set = new Set<string>(['Professional', 'Standard', 'Enterprise']);
    editionLookups.forEach((e: any) => {
      if (e.Edition_Name) set.add(e.Edition_Name);
    });
    pricingRules.forEach((r) => {
      if (r.edition) set.add(r.edition);
    });
    return Array.from(set);
  }, [editionLookups, pricingRules]);

  const planOptions = useMemo(() => {
    const set = new Set<string>(['Standard', 'Premium', 'Enterprise']);
    planLookups.forEach((p: any) => {
      if (p.Plan_Name || p.name) set.add(p.Plan_Name || p.name);
    });
    pricingRules.forEach((r) => {
      if (r.plan) set.add(r.plan);
    });
    return Array.from(set);
  }, [planLookups, pricingRules]);

  // Sync selected rule cleanly when live pricing list loads
  useEffect(() => {
    if (panelMode === 'create') return;
    if (pricingRules.length > 0) {
      const target =
        (initialPricingId && pricingRules.find((r) => r.id === initialPricingId || r.pricingId === initialPricingId)) ||
        pricingRules.find((r) => r.id === selectedRuleId) ||
        pricingRules[0];
      if (target && (target.id !== selectedRuleId || formData.id !== target.id)) {
        setSelectedRuleId(target.id);
        setFormData({ ...target });
      }
    }
  }, [pricingRules, selectedRuleId, initialPricingId, panelMode, formData.id]);

  // Active Selected Rule
  const selectedRule = useMemo(() => {
    return pricingRules.find((r) => r.id === selectedRuleId) || pricingRules[0] || formData;
  }, [pricingRules, selectedRuleId, formData]);

  // Tab switch triggers live API calls
  const handleTabChange = (tab: 'rules' | 'matrix' | 'bulk' | 'history') => {
    setActiveTab(tab);
    if (tab === 'rules') {
      refetchPricingList();
      refetchKpi();
    } else if (tab === 'matrix') {
      refetchMatrix();
    } else if (tab === 'history') {
      refetchHistory();
    } else if (tab === 'bulk') {
      handleBulkPreview();
    }
  };

  // Keep form data synced when switching selected row
  const handleSelectRow = (rule: PricingRule) => {
    setSelectedRuleId(rule.id);
    if (panelMode === 'create') {
      setPanelMode('view');
      setRightSubTab('overview');
    }
    setFormData({ ...rule });
  };

  // Switch to Create Mode in Right Panel
  const handleStartCreate = () => {
    const firstProd = productLookups[0];
    setFormData(createEmptyRule(firstProd?.Product_Name || 'Pegatto CRM', firstProd?.id ?? null));
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
    }
  };

  // Save changes from Right Panel form via ProductPricingCRUD/
  const handleSaveForm = async (saveAsStatus: 'Active' | 'Draft' = 'Active') => {
    const curCode = String(formData.currency || 'INR').split(' ')[0].toUpperCase();
    const numericPrice = Number(String(formData.priceNumeric || formData.price).replace(/[^0-9.]/g, '')) || 0;
    const numericTax = Number(String(formData.taxRate || '').replace(/[^0-9.]/g, ''));
    const nextStatus = panelMode === 'create' ? saveAsStatus : formData.status === 'Draft' ? saveAsStatus : formData.status;

    const payload: Record<string, any> = {
      Product_Id: formData.productId || formData.product,
      Country: formData.country || 'India',
      Region: formData.countryCode || 'IN',
      Currency: curCode,
      Currency_Symbol: CURRENCY_SYMBOL_MAP[curCode] || '₹',
      Price: numericPrice,
      Billing_Cycle: formData.billingCycle || 'Monthly',
      Pricing_Model: formData.licenseUnit || 'Per Tenant',
      Status: nextStatus,
      Effective_From: formData.effectiveFrom && formData.effectiveFrom !== '—' ? formData.effectiveFrom : null,
      Effective_To: formData.effectiveTo && formData.effectiveTo !== '—' ? formData.effectiveTo : null,
      Tax_Treatment: formData.taxTreatment || 'Exclusive of Tax',
      HSN_SAC_Code: formData.hsnCode || '',
      Tax_Rate: Number.isFinite(numericTax) && String(formData.taxRate).match(/\d/) ? numericTax : null,
      Tax_Label: formData.taxRate || '',
      Configured_Tiers: formData.tiers || [],
      Applicability: {
        edition_label: formData.edition || 'Standard',
        plan_label: formData.plan || 'Standard',
        segments: formData.applicableSegments || [],
        allow_discounts: formData.allowDiscounts,
        allow_customization: formData.allowCustomization,
        min_quantity: formData.minQuantity || 1,
      },
      Terms_And_Notes: formData.invoicingNotes || '',
    };

    try {
      let saved: any;
      if (panelMode === 'create') {
        if (formData.pricingId?.trim()) payload.Pricing_Id = formData.pricingId.trim();
        saved = await createProductPricing(payload).unwrap();
        toast.success(`Pricing rule ${saved?.Pricing_Id || ''} created successfully!`);
      } else {
        payload.id = formData.backendId ?? Number(formData.id);
        saved = await updateProductPricing(payload).unwrap();
        toast.success(`Pricing rule ${saved?.Pricing_Id || formData.pricingId} updated successfully!`);
      }
      if (saved?.id) {
        setSelectedRuleId(String(saved.id));
        setFormData(mapBackendPricingToRule(saved));
      }
      setPanelMode('view');
      setRightSubTab('overview');
      refetchPricingList();
      refetchKpi();
      refetchMatrix();
      refetchHistory();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to save pricing rule');
    }
  };

  // Cancel edit / create mode
  const handleCancelForm = () => {
    setPanelMode('view');
    setRightSubTab('overview');
    if (selectedRule) {
      setFormData({ ...selectedRule });
    }
  };

  // Delete rule via ProductPricingCRUD/
  const handleDeleteRule = async (rule: PricingRule) => {
    const pk = rule.backendId ?? rule.id;
    try {
      await deleteProductPricing({ id: pk }).unwrap();
      toast.success(`Deleted ${rule.pricingId}`);
      refetchPricingList();
      refetchKpi();
      refetchMatrix();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to delete pricing rule');
    }
  };

  // Filtered pricing rules (server already filters, client preserves instant search refinement)
  const filteredRules = pricingRules;

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

  // Export to CSV via ProductPricingExport/
  const handleExportCSV = async () => {
    const ok = await downloadProductPricingExportCsv({
      Product: filterProduct,
      Edition: filterEdition,
      Plan: filterPlan,
      Country: filterCountry,
      Currency: filterCurrency,
      Status: filterStatus,
      search: searchQuery,
      ids: selectedRowIds.length > 0 ? selectedRowIds : undefined,
    });
    if (ok) {
      toast.success('Pricing rules exported to CSV');
      return;
    }
    const headers = ['Pricing ID', 'Product', 'Edition', 'Plan', 'Country', 'Currency', 'Price', 'Billing Cycle', 'Status'];
    const rows = filteredRules.map((r) => [r.pricingId, r.product, r.edition, r.plan, r.country, r.currency, r.price, r.billingCycle, r.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Product_Pricing_Rules_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Pricing rules exported to CSV');
  };

  // Bulk Update Handlers
  const handleBulkPreview = async () => {
    try {
      const res = await bulkUpdatePricing({
        preview: true,
        Product: bulkProduct !== 'All' ? bulkProduct : undefined,
        Currency: bulkCurrency !== 'All' ? bulkCurrency : undefined,
        adjustment_type: bulkAdjType,
        adjustment_value: Number(String(bulkAdjValue).replace(/[^0-9.-]/g, '')) || 0,
      }).unwrap();
      setBulkPreviewCount(res?.affected_count ?? 0);
    } catch {
      setBulkPreviewCount(null);
    }
  };

  const handleBulkSubmit = async () => {
    try {
      const res = await bulkUpdatePricing({
        preview: false,
        Product: bulkProduct !== 'All' ? bulkProduct : undefined,
        Currency: bulkCurrency !== 'All' ? bulkCurrency : undefined,
        adjustment_type: bulkAdjType,
        adjustment_value: Number(String(bulkAdjValue).replace(/[^0-9.-]/g, '')) || 0,
        effective_date: bulkEffectiveDate || undefined,
      }).unwrap();
      toast.success(res?.message || 'Bulk price adjustment scheduled!');
      refetchPricingList();
      refetchKpi();
      refetchMatrix();
      refetchHistory();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to apply bulk adjustment');
    }
  };

  const handleScheduleSubmit = async () => {
    if (!selectedRule?.backendId) return;
    try {
      await scheduleProductPricing({
        id: selectedRule.backendId,
        new_price: newProposedPrice,
        effective_date: scheduleDate,
        notification_lead: scheduleLeadNote,
      }).unwrap();
      setIsScheduleModalOpen(false);
      toast.success(`Price revision to ${newProposedPrice} scheduled for ${scheduleDate}!`);
      refetchPricingList();
      refetchKpi();
      refetchHistory();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to schedule future price');
    }
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
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{kpiData?.total_rules ?? pricingRules.length}</h3>
          </div>
        </div>

        {/* Card 2: Active Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{kpiData?.active_prices ?? 0}</h3>
          </div>
        </div>

        {/* Card 3: Scheduled Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/70 shrink-0">
            <Clock className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Scheduled Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{kpiData?.scheduled_prices ?? 0}</h3>
          </div>
        </div>

        {/* Card 4: Expired Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100/70 shrink-0">
            <PauseCircle className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Expired Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{kpiData?.expired_prices ?? 0}</h3>
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
              onClick={() => handleTabChange(tab.id as any)}
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
                    {productLookups.map((p) => (
                      <option key={p.id} value={p.Product_Name}>
                        {p.Product_Name}
                      </option>
                    ))}
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
                    {editionOptions.map((ed) => (
                      <option key={ed} value={ed}>
                        {ed}
                      </option>
                    ))}
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
                    {planOptions.map((pl) => (
                      <option key={pl} value={pl}>
                        {pl}
                      </option>
                    ))}
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
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
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
                    <option value="GBP">GBP (£)</option>
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
                onClick={() => {
                  refetchPricingList();
                  toast.success('Pricing filters applied');
                }}
                className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 rounded-lg font-medium shadow-2xs cursor-pointer"
              >
                {isPricingFetching ? 'Loading...' : 'Apply'}
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

                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsColumnsOpen((prev) => !prev)}
                      className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                      <span>Columns</span>
                    </Button>
                    {isColumnsOpen && (
                      <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-lg p-2.5 z-30 space-y-1.5 text-xs">
                        <div className="text-[11px] font-bold text-slate-700 pb-1 border-b border-slate-100">
                          Visible Columns
                        </div>
                        {[
                          { key: 'pricingId', label: 'Pricing ID' },
                          { key: 'product', label: 'Product' },
                          { key: 'editionPlan', label: 'Edition / Plan' },
                          { key: 'country', label: 'Country' },
                          { key: 'price', label: 'Price' },
                          { key: 'cycle', label: 'Cycle' },
                          { key: 'status', label: 'Status' },
                        ].map((col) => (
                          <label key={col.key} className="flex items-center gap-2 py-0.5 text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleCols[col.key as keyof typeof visibleCols]}
                              onChange={(e) =>
                                setVisibleCols((prev) => ({
                                  ...prev,
                                  [col.key]: e.target.checked,
                                }))
                              }
                              className="rounded border-slate-300 accent-[#6222cc] h-3.5 w-3.5"
                            />
                            <span>{col.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
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
                        {visibleCols.pricingId && <th className="py-3 px-3 font-semibold text-slate-800">Pricing ID</th>}
                        {visibleCols.product && <th className="py-3 px-3 font-semibold text-slate-800">Product</th>}
                        {visibleCols.editionPlan && <th className="py-3 px-3 font-semibold text-slate-800">Edition / Plan</th>}
                        {visibleCols.country && <th className="py-3 px-3 font-semibold text-slate-800">Country</th>}
                        {visibleCols.price && <th className="py-3 px-3 font-semibold text-slate-800">Price</th>}
                        {visibleCols.cycle && <th className="py-3 px-3 font-semibold text-slate-800">Cycle</th>}
                        {visibleCols.status && <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>}
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

                            {visibleCols.pricingId && (
                              <td className="py-3 px-3 font-mono font-semibold text-[#6222cc] hover:underline whitespace-nowrap">
                                {rule.pricingId}
                              </td>
                            )}

                            {visibleCols.product && (
                              <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                                {rule.product}
                              </td>
                            )}

                            {visibleCols.editionPlan && (
                              <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                                <span className="font-medium text-slate-800">{rule.edition}</span>
                                <span className="text-slate-400 text-[10px] block">{rule.plan}</span>
                              </td>
                            )}

                            {visibleCols.country && (
                              <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span>{rule.country === 'India' ? '🇮🇳' : rule.country === 'United States' ? '🇺🇸' : '🌐'}</span>
                                  <span>{rule.country}</span>
                                </div>
                              </td>
                            )}

                            {visibleCols.price && (
                              <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                                {rule.price}
                              </td>
                            )}

                            {visibleCols.cycle && (
                              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                                {rule.billingCycle}
                              </td>
                            )}

                            {visibleCols.status && (
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
                            )}

                            {/* Actions */}
                            <td
                              className="py-3 px-3 text-center whitespace-nowrap relative"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(rule)}
                                  className="p-1 rounded text-slate-500 hover:text-[#6222cc] hover:bg-purple-50 transition-colors cursor-pointer"
                                  title="Edit Pricing Rule"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenOptionsRowId((prev) => (prev === rule.id ? null : rule.id))
                                    }
                                    className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="More Options"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </button>
                                  {openOptionsRowId === rule.id && (
                                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-30 text-left text-xs">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenOptionsRowId(null);
                                          handleStartEdit(rule);
                                        }}
                                        className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                                      >
                                        <Edit2 className="h-3.5 w-3.5 text-[#6222cc]" />
                                        <span>Edit Pricing Rule</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenOptionsRowId(null);
                                          setSelectedRuleId(rule.id);
                                          setNewProposedPrice(rule.price);
                                          setIsScheduleModalOpen(true);
                                        }}
                                        className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                                      >
                                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                                        <span>Schedule Future Price</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenOptionsRowId(null);
                                          setFormData({
                                            ...rule,
                                            id: `prc-${Date.now()}`,
                                            backendId: undefined,
                                            pricingId: '',
                                            status: 'Draft',
                                          });
                                          setPanelMode('create');
                                          setRightSubTab('details');
                                          toast.info(`Duplicated ${rule.pricingId} into New Rule form`);
                                        }}
                                        className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                                      >
                                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                                        <span>Duplicate Rule</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenOptionsRowId(null);
                                          handleDeleteRule(rule);
                                        }}
                                        className="w-full px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1 pt-1.5"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete Rule</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
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
                        Pricing Code / ID <span className="text-[10px] font-normal text-slate-400">(Auto-generated)</span>
                      </label>
                      <Input
                        value={formData.pricingId}
                        readOnly
                        disabled
                        className="h-8 text-xs font-mono font-semibold bg-slate-100 text-slate-500 cursor-not-allowed"
                        placeholder="Auto generated"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Product <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.product}
                        onChange={(e) => {
                          const found = productLookups.find((p) => p.Product_Name === e.target.value);
                          setFormData({
                            ...formData,
                            product: e.target.value,
                            productId: found?.id ?? null,
                          });
                        }}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        {productLookups.map((p) => (
                          <option key={p.id} value={p.Product_Name}>
                            {p.Product_Name}
                          </option>
                        ))}
                        {!productLookups.some((p) => p.Product_Name === formData.product) && formData.product && (
                          <option value={formData.product}>{formData.product}</option>
                        )}
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
                        {editionOptions.map((ed) => (
                          <option key={ed} value={ed}>
                            {ed}
                          </option>
                        ))}
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
                        {planOptions.map((pl) => (
                          <option key={pl} value={pl}>
                            {pl}
                          </option>
                        ))}
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
                          const matched = COUNTRY_OPTIONS.find((item) => item.name === c);
                          setFormData({
                            ...formData,
                            country: c,
                            countryCode: matched?.code || 'GL',
                            currency: matched?.currency || formData.currency || 'USD ($)',
                          });
                        }}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        {COUNTRY_OPTIONS.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.code === 'GL' ? `🌐 ${c.name}` : `${c.code} - ${c.name}`}
                          </option>
                        ))}
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
                Live edition base rates across international regions and currencies (`ProductPriceMatrix/`).
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                refetchMatrix();
                toast.success('Price matrix refreshed from backend');
              }}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-3 rounded-lg cursor-pointer"
            >
              <RefreshCw className={cn('h-3.5 w-3.5 mr-1', isMatrixFetching && 'animate-spin')} />
              Sync Matrix
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                  <th className="py-3 px-3">Product &amp; Edition</th>
                  <th className="py-3 px-3">Billing</th>
                  <th className="py-3 px-3">India (INR ₹)</th>
                  <th className="py-3 px-3">United States (USD $)</th>
                  <th className="py-3 px-3">Europe (EUR €)</th>
                  <th className="py-3 px-3">United Kingdom (GBP £)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No pricing matrix records found.
                    </td>
                  </tr>
                ) : (
                  matrixRows.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {row.product} ({row.edition})
                      </td>
                      <td className="py-3 px-3 text-slate-600">{row.cycle}</td>
                      <td className="py-3 px-3 font-bold text-slate-800 font-mono">{row.inr || '—'}</td>
                      <td className="py-3 px-3 font-bold text-slate-800 font-mono">{row.usd || '—'}</td>
                      <td className="py-3 px-3 font-bold text-slate-800 font-mono">{row.eur || '—'}</td>
                      <td className="py-3 px-3 font-bold text-slate-800 font-mono">{row.gbp || '—'}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                            row.status === 'Active'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : row.status === 'Scheduled'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
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
              Apply a percentage increase/decrease or fixed adjustment across multiple products and currencies (`ProductPricingBulkUpdate/`).
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Target Product</label>
                <select
                  value={bulkProduct}
                  onChange={(e) => setBulkProduct(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800"
                >
                  <option value="All">All Products</option>
                  {productLookups.map((p) => (
                    <option key={p.id} value={p.Product_Name}>
                      {p.Product_Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Target Currency</label>
                <select
                  value={bulkCurrency}
                  onChange={(e) => setBulkCurrency(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800"
                >
                  <option value="All">All Currencies</option>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Adjustment Type</label>
                <select
                  value={bulkAdjType}
                  onChange={(e) => setBulkAdjType(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800"
                >
                  <option value="increase_pct">Increase by Percentage (%)</option>
                  <option value="decrease_pct">Decrease by Percentage (%)</option>
                  <option value="fixed">Fixed Amount Addition</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Adjustment Value</label>
                <Input
                  value={bulkAdjValue}
                  onChange={(e) => setBulkAdjValue(e.target.value)}
                  className="h-8 text-xs font-bold"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Effective Scheduled Date</label>
              <Input
                type="date"
                value={bulkEffectiveDate}
                onChange={(e) => setBulkEffectiveDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-800 flex items-start gap-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                {bulkPreviewCount !== null
                  ? `Preview: ${bulkPreviewCount} pricing rule(s) will be updated and logged in Price History.`
                  : 'Click Preview Impact to calculate affected pricing rules before applying.'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isBulkUpdating}
                onClick={handleBulkPreview}
                className="text-xs h-8 px-3 rounded-lg border-slate-200 cursor-pointer"
              >
                Preview Impact
              </Button>
              <Button
                type="button"
                disabled={isBulkUpdating}
                onClick={handleBulkSubmit}
                className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 rounded-lg font-semibold cursor-pointer"
              >
                {isBulkUpdating ? 'Updating...' : 'Schedule Bulk Update'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRICE HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pricing Audit Trail &amp; History</h3>
              <p className="text-xs text-slate-500">
                Live chronological log from `ProductPriceHistory/`.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetchHistory()}
              className="text-xs h-8 px-3 rounded-lg cursor-pointer"
            >
              <RefreshCw className={cn('h-3.5 w-3.5 mr-1', isHistoryFetching && 'animate-spin')} />
              Refresh
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                  <th className="py-3 px-3">Date &amp; Time</th>
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
                {historyRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No pricing history entries recorded yet.
                    </td>
                  </tr>
                ) : (
                  historyRows.map((log: any) => {
                    const sym = CURRENCY_SYMBOL_MAP[(log.Currency || 'INR').toUpperCase()] || '₹';
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {log.Change_Date ? String(log.Change_Date).replace('T', ' ').slice(0, 16) : '—'}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-[#6222cc]">{log.Pricing_Id}</td>
                        <td className="py-3 px-3 font-medium text-slate-900">{log.Product_Label}</td>
                        <td className="py-3 px-3 text-slate-400 line-through font-mono">
                          {sym}{Number(log.Old_Price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 font-mono">
                          {sym}{Number(log.New_Price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-slate-700">{log.Changed_By_Name || 'Super Admin'}</td>
                        <td className="py-3 px-3 text-slate-600">{log.Reason || '—'}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                            {log.Status || 'Applied'}
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
              <select
                value={scheduleLeadNote}
                onChange={(e) => setScheduleLeadNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
              >
                <option value="Notify tenants 30 days in advance">Notify tenants 30 days in advance</option>
                <option value="Notify tenants 60 days in advance">Notify tenants 60 days in advance</option>
                <option value="Immediate notice on invoice">Immediate notice on invoice</option>
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
              disabled={isScheduling}
              onClick={handleScheduleSubmit}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold cursor-pointer"
            >
              {isScheduling ? 'Scheduling...' : 'Schedule Price'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
