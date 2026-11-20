'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  CreditCard,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  DollarSign,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Save,
  Tag,
  FileText,
  Upload,
  Copy,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  Hash,
  UserCheck,
  Landmark,
  MoreVertical,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
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
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import { ReusableTable, ColumnConfig } from '@/components/ui/ReusableTable';
import { cn } from '@/lib/utils';
import {
  useGetAccountsListQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetIndustryListQuery,
  AccountRecord,
} from '@/service/api/superAdminService';

const CHURN_REASONS = [
  'None (Active Customer)',
  'dissatisfaction with product',
  'dissatisfaction with service',
  'pricing concerns',
  'poor customerservice',
  'contract ended',
  'competitor migration',
];

const PAYMENT_TERMS_OPTIONS = ['Immediate', 'Net 15', 'Net 30', 'Net 60', 'Quarterly Advance', 'Annual Advance'];

const SAMPLE_TAGS = ['Enterprise', 'B2B', 'High Potential', 'SaaS', 'Strategic Partner', 'Tier-1'];

export default function AccountsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const isOverviewRoute = pathname?.includes('/overview') || searchParams.get('mode') === 'overview' || searchParams.get('action') === 'overview';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);
  const routeOverviewId = (params?.id as string) || (pathname?.includes('/overview/') ? pathname.split('/overview/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: accounts = [], isLoading, refetch, isFetching } = useGetAccountsListQuery();
  const { data: industries = [], refetch: refetchIndustries } = useGetIndustryListQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  // Country -> State -> City dependent dropdown states
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  useEffect(() => {
    GetCountries().then((data: any) => {
      if (Array.isArray(data)) {
        setCountriesList(data);
        const defaultCountry = data.find((c: any) => c.name === 'India') || data[0];
        if (defaultCountry) {
          setSelectedCountryId(defaultCountry.id);
          GetState(defaultCountry.id).then((st: any) => {
            if (Array.isArray(st)) setStatesList(st);
          });
        }
      }
    }).catch(() => { });
  }, []);

  // View mode: 'list' | 'create' | 'edit' (URL route always determines view mode on mount/refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  // Re-fetch master data immediately when entering Create or Edit mode
  useEffect(() => {
    if (viewMode === 'create' || viewMode === 'edit') {
      refetchIndustries();
    }
  }, [viewMode, refetchIndustries]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [listType, setListType] = useState<'all' | 'my'>('all');
  const [overviewPickerSearch, setOverviewPickerSearch] = useState('');

  const overviewFilteredAccounts = useMemo(() => {
    if (!overviewPickerSearch.trim()) return accounts;
    const q = overviewPickerSearch.toLowerCase();
    return accounts.filter((a: any) =>
      a.Organization_Name?.toLowerCase().includes(q) ||
      a.Contact_Name?.toLowerCase().includes(q) ||
      a.Industry?.toLowerCase().includes(q)
    );
  }, [accounts, overviewPickerSearch]);

  // Selected item, overview flyout drawer & delete modal
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountRecord | null>(null);

  // Auto-open overview if navigating to /accounts/overview/:id directly
  useEffect(() => {
    if (isOverviewRoute && routeOverviewId && accounts.length > 0) {
      const acc = accounts.find((a: any) => String(a.id) === String(routeOverviewId));
      if (acc) {
        setSelectedAccount(acc);
        setIsOverviewOpen(true);
      }
    }
  }, [isOverviewRoute, routeOverviewId, accounts]);

  // Escape key handler to close overview drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOverviewOpen) {
        handleCloseOverview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOverviewOpen, isOverviewRoute]);

  // Lock body scroll when overview flyout is open
  useEffect(() => {
    if (isOverviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOverviewOpen]);

  // Form State adhering strictly to CreateAccountForm.js specifications
  const initialFormState = {
    Organization_Name: '',
    Contact_Name: '',
    Mail: '',
    Phone_Number: '',
    Land_Line: '',
    Fax: '',
    Lead_Name: '',
    Account_Owner: 'SuperAdmin Admin',
    Industry: '',
    Employees: '',
    Turn_Over: '',
    GST_No: '',
    Payment_Terms: 'Net 30',
    Country: 'India',
    Country_Code: '+91',
    State: '',
    City: '',
    Location: '',
    BuildingDoorNo: '',
    StreetName: '',
    AreaName: '',
    Pincode: '',
    ReasonForChurn: 'None (Active Customer)',
    Active_Flag: true,
    tags: ['Enterprise', 'B2B'] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // When refreshing directly on an Edit page (/accounts/edit/:id), auto-populate formData once accounts load
  useEffect(() => {
    if (isEditRoute && routeEditId && accounts.length > 0) {
      const acc = accounts.find((a: any) => String(a.id) === String(routeEditId));
      if (acc && (!selectedAccount || String(selectedAccount.id) !== String(acc.id))) {
        setSelectedAccount(acc);
        setFormData({
          Organization_Name: acc.Organization_Name || '',
          Contact_Name: acc.Contact_Name || '',
          Mail: acc.Mail || '',
          Phone_Number: acc.Phone_Number || '',
          Land_Line: acc.Land_Line || '',
          Fax: acc.Fax || '',
          Lead_Name: '',
          Account_Owner: acc.Account_Owner || 'SuperAdmin Admin',
          Industry: acc.Industry || '',
          Employees: String(acc.Employees || ''),
          Turn_Over: acc.Turn_Over || '',
          GST_No: acc.GST_No || '',
          Payment_Terms: acc.Payment_Terms || 'Net 30',
          Country: acc.Country || 'India',
          Country_Code: acc.Country_Code || '+91',
          State: acc.State || '',
          City: acc.City || '',
          Location: acc.Location || acc.City || '',
          BuildingDoorNo: acc.Address?.BuildingDoorNo || '',
          StreetName: acc.Address?.StreetName || '',
          AreaName: acc.Address?.AreaName || '',
          Pincode: acc.Address?.Pincode || '',
          ReasonForChurn: 'None (Active Customer)',
          Active_Flag: acc.Active_Flag !== false,
          tags: ['Enterprise', 'B2B'],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, accounts, selectedAccount]);

  const handleCountryChange = (countryName: string) => {
    const matched = countriesList.find((c) => c.name === countryName);
    const countryId = matched ? matched.id : null;
    setSelectedCountryId(countryId);
    setSelectedStateId(null);
    setCitiesList([]);
    setFormData((prev) => ({
      ...prev,
      Country: countryName,
      Country_Code: matched?.phone_code ? `+${matched.phone_code}` : prev.Country_Code,
      State: '',
      City: '',
    }));
    if (countryId) {
      GetState(countryId).then((st: any) => {
        if (Array.isArray(st)) setStatesList(st);
      });
    } else {
      setStatesList([]);
    }
  };

  const handleStateChange = (stateName: string) => {
    const matched = statesList.find((s) => s.name === stateName);
    const stateId = matched ? matched.id : null;
    setSelectedStateId(stateId);
    setFormData((prev) => ({
      ...prev,
      State: stateName,
      City: '',
    }));
    if (selectedCountryId && stateId) {
      GetCity(selectedCountryId, stateId).then((ct: any) => {
        if (Array.isArray(ct)) setCitiesList(ct);
      });
    } else {
      setCitiesList([]);
    }
  };

  const handleOpenCreate = () => {
    setSelectedAccount(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push('/accounts/create');
  };

  const handleOpenEdit = (acc: AccountRecord) => {
    setSelectedAccount(acc);
    setFormData({
      Organization_Name: acc.Organization_Name || '',
      Contact_Name: acc.Contact_Name || '',
      Mail: acc.Mail || '',
      Phone_Number: acc.Phone_Number || '',
      Land_Line: acc.Land_Line || '',
      Fax: acc.Fax || '',
      Lead_Name: '',
      Account_Owner: acc.Account_Owner || 'SuperAdmin Admin',
      Industry: acc.Industry || '',
      Employees: String(acc.Employees || ''),
      Turn_Over: acc.Turn_Over || '',
      GST_No: acc.GST_No || '',
      Payment_Terms: acc.Payment_Terms || 'Net 30',
      Country: acc.Country || 'India',
      Country_Code: acc.Country_Code || '+91',
      State: acc.State || '',
      City: acc.City || '',
      Location: acc.Location || acc.City || '',
      BuildingDoorNo: acc.Address?.BuildingDoorNo || '',
      StreetName: acc.Address?.StreetName || '',
      AreaName: acc.Address?.AreaName || '',
      Pincode: acc.Address?.Pincode || '',
      ReasonForChurn: 'None (Active Customer)',
      Active_Flag: acc.Active_Flag !== false,
      tags: ['Enterprise', 'B2B'],
      notes: '',
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`/accounts/edit/${acc.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/accounts');
  };

  const handleOpenOverview = (acc: AccountRecord) => {
    router.push(`/accounts/overview/${acc.id}`);
  };

  const handleCloseOverview = () => {
    setIsOverviewOpen(false);
    if (isOverviewRoute) {
      router.push('/accounts');
    }
  };

  const handleOpenView = handleOpenOverview;

  const copyToClipboard = (text?: string, label: string = 'Information') => {
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    }
  };

  const formatAccountDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently registered';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopySummary = () => {
    if (!selectedAccount) return;
    const summary = `
CUSTOMER ACCOUNT DOSSIER: ${selectedAccount.Organization_Name}
Tenant ID: #ACC-${selectedAccount.id}
Status: ${selectedAccount.Active_Flag !== false ? 'Active Enterprise Account' : 'Suspended Account'}
Created By: ${selectedAccount.Account_Owner || 'SuperAdmin Admin'} (#USR-00${selectedAccount.Created_By || 1})
Created Date: ${formatAccountDate(selectedAccount.Created_Date)}
Primary Contact: ${selectedAccount.Contact_Name || 'N/A'}
Contact Email: ${selectedAccount.Mail || 'N/A'}
Contact Phone: ${selectedAccount.Phone_Number || 'N/A'}
Industry: ${selectedAccount.Industry || 'Enterprise SaaS'}
Registered Headquarters: ${[selectedAccount.City, selectedAccount.State, selectedAccount.Country].filter(Boolean).join(', ') || 'N/A'}
Annual Turnover: ${selectedAccount.Turn_Over || 'N/A'}
Team Headcount: ${selectedAccount.Employees || 'N/A'}
GST / Tax ID: ${selectedAccount.GST_No || 'N/A'}
Commercial Payment Terms: ${selectedAccount.Payment_Terms || 'Net 30'}
    `.trim();
    copyToClipboard(summary, 'Complete Account Dossier');
  };

  const handleOpenDelete = (acc: AccountRecord) => {
    setSelectedAccount(acc);
    setIsDeleteOpen(true);
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.Organization_Name.trim()) {
      errors.Organization_Name = 'Organization Name is mandatory';
    }
    if (!formData.Contact_Name.trim()) {
      errors.Contact_Name = 'Contact Name is mandatory';
    }
    if (!formData.Mail.trim()) {
      errors.Mail = 'Email address is mandatory';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Mail)) {
      errors.Mail = 'Please enter a valid email format';
    }
    if (!formData.Phone_Number.trim()) {
      errors.Phone_Number = 'Phone number is mandatory';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please complete all mandatory fields');
      return;
    }

    const orgId = typeof window !== 'undefined' ? (localStorage.getItem('OrganizationId') || '1') : '1';
    const userId = typeof window !== 'undefined' ? (localStorage.getItem('UserId') || '1') : '1';
    const today = new Date().toISOString().split('T')[0];

    const payload: any = {
      Organization_Name: formData.Organization_Name.trim(),
      Contact_Name: formData.Contact_Name.trim(),
      Mail: formData.Mail.trim(),
      Phone_Number: formData.Phone_Number.trim(),
      Land_Line: formData.Land_Line.trim(),
      Fax: formData.Fax.trim(),
      Account_Owner: formData.Account_Owner || 'SuperAdmin Admin',
      Industry: formData.Industry,
      Turn_Over: formData.Turn_Over,
      Employees: formData.Employees,
      GST_No: formData.GST_No,
      Payment_Terms: formData.Payment_Terms,
      Country: formData.Country,
      Country_Code: formData.Country_Code,
      State: formData.State,
      City: formData.City,
      Location: formData.Location || formData.City,
      Active_Flag: formData.Active_Flag,
      Status_Flag: String(formData.Active_Flag),
      Is_Deleted: false,
      Organization_Id: Number(orgId),
      Created_By: Number(userId),
      Updated_By: Number(userId),
      Created_Date: today,
      Updated_Date: today,
      LeadCheck: 0,
      Lead_Id: null,
      Address: {
        BuildingDoorNo: formData.BuildingDoorNo,
        StreetName: formData.StreetName,
        AreaName: formData.AreaName,
        Pincode: formData.Pincode,
      },
    };

    try {
      if (viewMode === 'edit' && selectedAccount?.id) {
        await updateAccount({ id: selectedAccount.id, ...payload }).unwrap();
        toast.success(`Account "${formData.Organization_Name}" updated successfully`);
      } else {
        await createAccount(payload).unwrap();
        toast.success(`Account "${formData.Organization_Name}" created successfully on SuperAdmin backend`);
      }
      handleBackToList();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Operation failed. Check network or permissions.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAccount?.id) return;
    try {
      await deleteAccount({ id: selectedAccount.id }).unwrap();
      toast.success(`Account "${selectedAccount.Organization_Name}" removed successfully`);
      setIsDeleteOpen(false);
      setSelectedAccount(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete account');
    }
  };

  const isMyAccount = (acc: AccountRecord) => {
    const owner = (acc.Account_Owner || '').toLowerCase();
    const storedUser = typeof window !== 'undefined' ? (localStorage.getItem('Username') || '').toLowerCase() : '';
    const storedId = typeof window !== 'undefined' ? (localStorage.getItem('UserId') || '').toLowerCase() : '';

    if (storedUser && owner.includes(storedUser)) return true;
    if (storedId && String(acc.Created_By || '').toLowerCase() === storedId) return true;
    return owner.includes('kavi') || owner.includes('kavitha') || owner.includes('admin');
  };

  const myAccountsCount = useMemo(() => {
    return accounts.filter(isMyAccount).length;
  }, [accounts]);

  // Filtered accounts based on search and listType ('all' vs 'my')
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const s = searchTerm.toLowerCase();
      const matchSearch =
        searchTerm === '' ||
        acc.Organization_Name?.toLowerCase().includes(s) ||
        acc.Contact_Name?.toLowerCase().includes(s) ||
        acc.Mail?.toLowerCase().includes(s) ||
        acc.Phone_Number?.toLowerCase().includes(s) ||
        acc.City?.toLowerCase().includes(s) ||
        acc.Industry?.toLowerCase().includes(s) ||
        acc.Account_Owner?.toLowerCase().includes(s);

      const matchListType = listType === 'all' || isMyAccount(acc);

      return matchSearch && matchListType;
    });
  }, [accounts, searchTerm, listType]);

  // Table Column Definitions for ReusableTable
  const accountColumns: ColumnConfig<AccountRecord>[] = useMemo(() => [
    {
      key: 'Organization_Name',
      header: 'Organization & Industry',
      sortable: true,
      draggable: true,
      render: (account) => (
        <div className="flex items-center gap-3 py-1 group/account">
          <div
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/15 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-200/60 dark:border-blue-800/60 shadow-2xs shrink-0 group-hover/account:scale-105 group-hover/account:shadow-xs transition-all cursor-pointer"
            onClick={() => handleOpenOverview(account)}
            title={`Click to view Overview for ${account.Organization_Name}`}
          >
            {account.Organization_Name ? account.Organization_Name.slice(0, 2).toUpperCase() : 'AC'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate transition-colors text-xs hover:underline decoration-blue-500/50 underline-offset-2"
                onClick={() => handleOpenOverview(account)}
                title={`Click to view Overview for ${account.Organization_Name}`}
              >
                {account.Organization_Name}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 font-medium opacity-0 group-hover/account:opacity-100 transition-opacity hidden sm:inline-block">
                Overview
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
              <Briefcase className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="truncate">{account.Industry || 'Enterprise SaaS'}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'Contact_Name',
      header: 'Primary Contact & Email',
      sortable: true,
      draggable: true,
      render: (account) => (
        <div className="min-w-0 space-y-0.5 text-xs py-1">
          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
            {account.Contact_Name || 'Primary Contact'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
            <Mail className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{account.Mail || '—'}</span>
          </div>
          {account.Phone_Number && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
              <Phone className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="truncate">{account.Phone_Number}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'Location',
      header: 'Location & Owner',
      sortable: true,
      draggable: true,
      render: (account) => (
        <div className="space-y-0.5 text-xs py-1">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 truncate">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{[account.City, account.State, account.Country].filter(Boolean).join(', ') || 'N/A'}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pl-4">
            <span>Owner:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{account.Account_Owner || 'Admin'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'Turn_Over',
      header: 'Size & Terms',
      sortable: false,
      draggable: true,
      render: (account) => (
        <div className="space-y-0.5 text-xs py-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {account.Turn_Over || '$1M+'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Users className="h-3 w-3 text-slate-400" />
              {account.Employees || '50+'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            <span>Terms: </span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              {account.Payment_Terms || 'Net 30'}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'Active_Flag',
      header: 'Status',
      align: 'center',
      sortable: true,
      draggable: true,
      render: (account) => (
        <div className="flex items-center justify-center py-1">
          {account.Active_Flag !== false ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400 shrink-0" />
              Suspended
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'Created_Date',
      header: 'Created Date',
      sortable: true,
      draggable: true,
      render: (account) => (
        <div className="text-xs font-mono text-slate-600 dark:text-slate-400 py-1">
          {account.Created_Date ? account.Created_Date.split('T')[0] : '2026-11-17'}
        </div>
      ),
    },
  ], []);

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
                  Customer Accounts
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Account' : 'Create New Account'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Account: ${selectedAccount?.Organization_Name || ''}` : 'Create New Customer Account'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Account'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: ORGANIZATION INFORMATION */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ORGANIZATION INFORMATION
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Organization_Name" className="text-xs font-semibold uppercase tracking-wider">
                      ORGANIZATION / COMPANY NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Organization_Name"
                      placeholder="Enter company name"
                      value={formData.Organization_Name}
                      onChange={(e) => setFormData({ ...formData, Organization_Name: e.target.value })}
                      className={formErrors.Organization_Name ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Organization_Name && (
                      <p className="text-[11px] text-rose-500">{formErrors.Organization_Name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Industry" className="text-xs font-semibold uppercase tracking-wider">
                      INDUSTRY
                    </Label>
                    <select
                      id="Industry"
                      value={formData.Industry}
                      onChange={(e) => setFormData({ ...formData, Industry: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select Industry</option>
                      {industries.map((ind) => (
                        <option key={ind.id} value={ind.label}>
                          {ind.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Contact_Name" className="text-xs font-semibold uppercase tracking-wider">
                      PRIMARY CONTACT NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Contact_Name"
                      placeholder="Enter full name"
                      value={formData.Contact_Name}
                      onChange={(e) => setFormData({ ...formData, Contact_Name: e.target.value })}
                      className={formErrors.Contact_Name ? 'border-rose-500' : ''}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Mail" className="text-xs font-semibold uppercase tracking-wider">
                      EMAIL ADDRESS <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Mail"
                      type="email"
                      placeholder="contact@company.com"
                      value={formData.Mail}
                      onChange={(e) => setFormData({ ...formData, Mail: e.target.value })}
                      className={formErrors.Mail ? 'border-rose-500' : ''}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Phone_Number" className="text-xs font-semibold uppercase tracking-wider">
                      PHONE NUMBER <span className="text-rose-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.Country_Code || '+91'}
                        onChange={(e) => setFormData({ ...formData, Country_Code: e.target.value })}
                        className="w-16 text-center font-mono text-xs"
                      />
                      <Input
                        id="Phone_Number"
                        placeholder="Enter phone number"
                        value={formData.Phone_Number}
                        onChange={(e) => setFormData({ ...formData, Phone_Number: e.target.value })}
                        className={`flex-1 ${formErrors.Phone_Number ? 'border-rose-500' : ''}`}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Land_Line" className="text-xs font-semibold uppercase tracking-wider">
                      LANDLINE / EXTENSION
                    </Label>
                    <Input
                      id="Land_Line"
                      placeholder="e.g. 044-2450123"
                      value={formData.Land_Line}
                      onChange={(e) => setFormData({ ...formData, Land_Line: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Fax" className="text-xs font-semibold uppercase tracking-wider">
                      FAX NUMBER
                    </Label>
                    <Input
                      id="Fax"
                      placeholder="Enter fax number"
                      value={formData.Fax}
                      onChange={(e) => setFormData({ ...formData, Fax: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="GST_No" className="text-xs font-semibold uppercase tracking-wider">
                      TAX ID / GST NO
                    </Label>
                    <Input
                      id="GST_No"
                      placeholder="e.g. 29ABCDE1234F1Z5"
                      value={formData.GST_No}
                      onChange={(e) => setFormData({ ...formData, GST_No: e.target.value })}
                      className="font-mono uppercase"
                    />
                  </div>

                  {/* Address Section with Dependent Country -> State -> City Dropdowns */}
                  <div className="space-y-1.5 md:col-span-3 pt-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider">
                      REGISTERED ADDRESS & LOCATION
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase">Door / Building No</Label>
                        <Input
                          placeholder="Building / Door No"
                          value={formData.BuildingDoorNo}
                          onChange={(e) => setFormData({ ...formData, BuildingDoorNo: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase">Street Name</Label>
                        <Input
                          placeholder="Street Name"
                          value={formData.StreetName}
                          onChange={(e) => setFormData({ ...formData, StreetName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase">Area / Locality</Label>
                        <Input
                          placeholder="Area / Locality"
                          value={formData.AreaName}
                          onChange={(e) => setFormData({ ...formData, AreaName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase">Country</Label>
                        <select
                          value={formData.Country}
                          onChange={(e) => handleCountryChange(e.target.value)}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Select Country</option>
                          {countriesList.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase">State / Province</Label>
                        {statesList.length > 0 ? (
                          <select
                            value={formData.State}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">Select State</option>
                            {statesList.map((s) => (
                              <option key={s.id} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            placeholder="State / Province"
                            value={formData.State}
                            onChange={(e) => setFormData({ ...formData, State: e.target.value })}
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase">City</Label>
                        {citiesList.length > 0 ? (
                          <select
                            value={formData.City}
                            onChange={(e) => setFormData({ ...formData, City: e.target.value, Location: e.target.value })}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">Select City</option>
                            {citiesList.map((ct) => (
                              <option key={ct.id} value={ct.name}>
                                {ct.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            placeholder="City"
                            value={formData.City}
                            onChange={(e) => setFormData({ ...formData, City: e.target.value, Location: e.target.value })}
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase">Pincode / Postal Code</Label>
                        <Input
                          placeholder="Pincode / Postal Code"
                          value={formData.Pincode}
                          onChange={(e) => setFormData({ ...formData, Pincode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: ADDITIONAL INFORMATION */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ADDITIONAL INFORMATION & OPERATIONAL METRICS
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="Employees" className="text-xs font-semibold uppercase tracking-wider">
                      NUMBER OF EMPLOYEES
                    </Label>
                    <Input
                      id="Employees"
                      placeholder="e.g. 50-100"
                      value={formData.Employees}
                      onChange={(e) => setFormData({ ...formData, Employees: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Turn_Over" className="text-xs font-semibold uppercase tracking-wider">
                      ANNUAL REVENUE / TURNOVER
                    </Label>
                    <Input
                      id="Turn_Over"
                      placeholder="e.g. $5M"
                      value={formData.Turn_Over}
                      onChange={(e) => setFormData({ ...formData, Turn_Over: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Payment_Terms" className="text-xs font-semibold uppercase tracking-wider">
                      PAYMENT TERMS
                    </Label>
                    <select
                      id="Payment_Terms"
                      value={formData.Payment_Terms}
                      onChange={(e) => setFormData({ ...formData, Payment_Terms: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {PAYMENT_TERMS_OPTIONS.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: ACCOUNT STATUS & ACCESS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ACCOUNT STATUS & LICENSING
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60">
                  <input
                    type="checkbox"
                    id="Active_Flag"
                    checked={formData.Active_Flag}
                    onChange={(e) => setFormData({ ...formData, Active_Flag: e.target.checked })}
                    className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <Label htmlFor="Active_Flag" className="cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Active Customer Account
                    </Label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-relaxed">
                      Enables tenant workspace access, multi-seat licensing, and active cloud instance provisioning.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: TAGS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  CLASSIFICATION TAGS
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_TAGS.map((tag) => {
                    const isSelected = formData.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted/70'
                          }`}
                      >
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
                  INTERNAL ACCOUNT NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Enter strategic background notes, implementation milestones, or custom SLA terms..."
                  rows={4}
                  value={formData.notes}
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
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Customer Accounts</span>
            </h1>
            <Badge variant="outline" className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
              {accounts.length} Active Tenants
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            SuperAdmin central tenant directory: manage customer accounts, business contacts, and SLA allocations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="h-10 px-3.5 gap-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs cursor-pointer font-medium text-xs rounded-lg"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </Button>

          {/* Account Overview Name Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-10 px-3.5 gap-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs cursor-pointer font-semibold text-xs rounded-lg flex items-center"
                >
                  <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Overview (Name Picker)</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              sideOffset={4}
              className="w-80 sm:w-96 p-2 shadow-2xl rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50 text-left"
            >
              <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Pick Account to View Overview
                </p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search account name or industry..."
                    value={overviewPickerSearch}
                    onChange={(e) => setOverviewPickerSearch(e.target.value)}
                    className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto py-1 space-y-0.5">
                {overviewFilteredAccounts.map((acc: any) => (
                  <DropdownMenuItem
                    key={acc.id}
                    onClick={() => router.push(`/accounts/overview/${acc.id}`)}
                    className="flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {acc.Organization_Name ? acc.Organization_Name.slice(0, 2).toUpperCase() : 'AC'}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-xs">{acc.Organization_Name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{acc.Industry || 'Enterprise'} • {acc.City || 'Global'}</p>
                      </div>
                    </div>
                    <Eye className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-2" />
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleOpenCreate}
            className="h-10 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 rounded-lg flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar: Removed All Industries and All Statuses, Replaced with All List / My List */}
      <Card className="border-border shadow-xs bg-white dark:bg-slate-900">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by company, contact, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>

            {/* All List / My List Segmented Tabs */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setListType('all')}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer",
                    listType === 'all'
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/70 dark:border-slate-700 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>All List</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5",
                    listType === 'all'
                      ? "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  )}>
                    {accounts.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setListType('my')}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer",
                    listType === 'my'
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/70 dark:border-slate-700 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>My List</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5",
                    listType === 'my'
                      ? "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  )}>
                    {myAccountsCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Accounts ReusableTable */}
      <Card className="border-border shadow-xs bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-3 sm:p-4">
          <ReusableTable<AccountRecord>
            data={filteredAccounts}
            columns={accountColumns}
            actions={(account) => (
              <div className="flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  } />
                  <DropdownMenuContent
                    align="end"
                    sideOffset={4}
                    className="w-36 rounded-2xl p-1.5 shadow-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 z-50 text-left space-y-0.5"
                  >
                    <DropdownMenuItem
                      onClick={() => handleOpenOverview(account)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                    >
                      <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span>Overview</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleOpenEdit(account)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span>Edit</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleOpenDelete(account)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            initialPageSize={10}
            showGear={true}
            showExport={true}
            exportFileName="Customer_Accounts_Ledger"
            title="Customer Accounts"
            loading={isLoading || isFetching}
            stickyHeader={true}
          />
        </div>
      </Card>

      {/* ====================================================================== */}
      {/* NEW CUSTOMER ACCOUNT OVERVIEW FLYOUT DRAWER (HOVERS OVER THE SCREEN) */}
      {/* ====================================================================== */}
      {isOverviewOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Frosted Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
            onClick={handleCloseOverview}
            aria-hidden="true"
          />

          {/* Slide-Over Panel Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
            <div className="w-screen max-w-2xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-all duration-300 animate-in slide-in-from-right pointer-events-auto">
              
              {/* 1. MEANINGFUL HEADER */}
              <div className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 backdrop-blur-sm shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base border border-blue-500/20 shadow-md shrink-0">
                      {selectedAccount.Organization_Name ? selectedAccount.Organization_Name.slice(0, 2).toUpperCase() : 'AC'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                          #ACC-{selectedAccount.id}
                        </span>
                        {selectedAccount.Active_Flag !== false ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                            Active Enterprise Account
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
                            Suspended Account
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <Briefcase className="h-3 w-3 text-slate-400" />
                          {selectedAccount.Industry || 'Enterprise SaaS'}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate" title={selectedAccount.Organization_Name}>
                        {selectedAccount.Organization_Name}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Tenant & Administrative User Dossier</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          Registered {formatAccountDate(selectedAccount.Created_Date)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        handleCloseOverview();
                        handleOpenEdit(selectedAccount);
                      }}
                      className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-2xs gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Account</span>
                    </Button>
                    <button
                      type="button"
                      onClick={handleCloseOverview}
                      className="h-8 w-8 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                      title="Close Overview (Esc)"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. SCROLLABLE CONTENT BODY */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                
                {/* CARD 1: CREATED USER & SYSTEM AUDIT INFORMATION */}
                <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-transparent dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900/40 p-4.5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-blue-200/60 dark:border-blue-900/50">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                          CREATED USER & SYSTEM AUDIT
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Official administrative creator details, provisioning timestamp, and ownership
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800">
                      System Verified
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs">
                    {/* Created By User */}
                    <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-blue-100/80 dark:border-slate-700/80 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 font-medium">
                          <UserCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          Created By User
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">#USR-00{selectedAccount.Created_By || 1}</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {selectedAccount.Account_Owner || 'SuperAdmin Admin'}
                      </div>
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        SuperAdmin Account Executive
                      </div>
                    </div>

                    {/* Registration Date */}
                    <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-blue-100/80 dark:border-slate-700/80 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          Created Date & Timestamp
                        </span>
                        <span className="text-[10px] text-blue-600 font-semibold">Provisioned</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {formatAccountDate(selectedAccount.Created_Date)}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Official Tenant System Deployment
                      </div>
                    </div>

                    {/* Assigned Manager / Owner */}
                    <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-blue-100/80 dark:border-slate-700/80 shadow-2xs space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        Assigned Account Owner
                      </div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedAccount.Account_Owner || 'SuperAdmin Admin'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Dedicated Client Success Lead
                      </div>
                    </div>

                    {/* Last Modified Audit */}
                    <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-blue-100/80 dark:border-slate-700/80 shadow-2xs space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        Last Audit Update
                      </div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {formatAccountDate(selectedAccount.Updated_Date || selectedAccount.Created_Date)}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        By User ID #USR-{selectedAccount.Updated_By || selectedAccount.Created_By || 1}
                      </div>
                    </div>

                    {/* Provisioning Origin */}
                    <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-blue-100/80 dark:border-slate-700/80 shadow-2xs space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        Provisioning Channel
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedAccount.LeadCheck ? 'Converted from Lead Pipeline' : 'Direct SuperAdmin Provisioning'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Authorized SuperAdmin Tenant
                      </div>
                    </div>

                    {/* Tenant Cloud Reference Code */}
                    <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-blue-100/80 dark:border-slate-700/80 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 font-medium">
                          <Hash className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          Cloud Tenant UID
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`CRMFARM-TENANT-${String(selectedAccount.id).padStart(5, '0')}`, 'Tenant UID')}
                          className="text-blue-600 hover:text-blue-700 cursor-pointer"
                          title="Copy UID"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                        CRMFARM-TENANT-{String(selectedAccount.id).padStart(5, '0')}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Workspace Reference Key
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: PRIMARY CONTACT PERSON & COMMUNICATION */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                          PRIMARY CONTACT PERSON DETAILS
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Primary administrative representative and contact channels
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    {/* Contact Name */}
                    <div className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Full Contact Name</span>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {selectedAccount.Contact_Name || 'Primary Contact'}
                      </div>
                      <span className="text-[10px] inline-block px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-medium">
                        Primary Tenant Admin
                      </span>
                    </div>

                    {/* Email */}
                    <div className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Email Address</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={selectedAccount.Mail}>
                          {selectedAccount.Mail || '—'}
                        </span>
                        {selectedAccount.Mail && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(selectedAccount.Mail, 'Email')}
                              className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              title="Copy Email"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <a
                              href={`mailto:${selectedAccount.Mail}`}
                              className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Verified Business Inbox</span>
                    </div>

                    {/* Phone */}
                    <div className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Phone / Mobile</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedAccount.Country_Code ? `${selectedAccount.Country_Code} ` : ''}{selectedAccount.Phone_Number || '—'}
                        </span>
                        {selectedAccount.Phone_Number && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(selectedAccount.Phone_Number, 'Phone Number')}
                              className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              title="Copy Phone"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <a
                              href={`tel:${selectedAccount.Phone_Number}`}
                              className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                              title="Call"
                            >
                              <Phone className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Direct Line</span>
                    </div>

                    {/* Landline & Fax */}
                    <div className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Landline & Office Extension</span>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedAccount.Land_Line || 'None listed'}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Fax: {selectedAccount.Fax || '—'}
                      </span>
                    </div>

                    {/* Tenant Web Domain */}
                    <div className="col-span-1 sm:col-span-2 p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Tenant Workspace Subdomain</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                          https://{selectedAccount.Organization_Name.toLowerCase().replace(/[^a-z0-9]/g, '')}.crmfarm.com
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/70">
                        SSL Secured
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: COMMERCIAL & TENANT PARAMETERS */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                          COMMERCIAL & ENTERPRISE PROFILE
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Organization size, turnover, billing schedule, and tax registry
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Annual Turnover</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                        {selectedAccount.Turn_Over || '$1M+'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Team Scale</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                        {selectedAccount.Employees || '50+'} Employees
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Payment Terms</span>
                      <Badge variant="outline" className="mt-1 text-[11px] font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700">
                        {selectedAccount.Payment_Terms || 'Net 30'}
                      </Badge>
                    </div>

                    <div className="col-span-2 sm:col-span-3 p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">GST / Tax Registration ID</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                          {selectedAccount.GST_No || 'N/A (Unspecified)'}
                        </span>
                      </div>
                      {selectedAccount.GST_No && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(selectedAccount.GST_No, 'GST / Tax ID')}
                          className="h-7 text-xs text-blue-600 gap-1 cursor-pointer"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD 4: REGISTERED HEADQUARTERS ADDRESS */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                          REGISTERED HEADQUARTERS ADDRESS
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Official registered office and billing dispatch location
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50/70 dark:bg-slate-800/50 rounded-lg border border-slate-200/70 dark:border-slate-700/70 text-xs leading-relaxed space-y-2">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {[
                        selectedAccount.Address?.BuildingDoorNo,
                        selectedAccount.Address?.StreetName,
                        selectedAccount.Address?.AreaName,
                      ].filter(Boolean).join(', ') || 'Building / Street not specified'}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {[selectedAccount.City, selectedAccount.State, selectedAccount.Country].filter(Boolean).join(', ') || 'Location Unspecified'}
                      </span>
                      {selectedAccount.Address?.Pincode && (
                        <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          PIN: {selectedAccount.Address.Pincode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. STICKY ACTION FOOTER BAR */}
              <div className="px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-between gap-3 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseOverview}
                  className="h-9 px-4 text-xs font-medium border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Close Overview
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopySummary}
                    className="h-9 px-3.5 text-xs font-medium border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy Summary</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      handleCloseOverview();
                      handleOpenEdit(selectedAccount);
                    }}
                    className="h-9 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-2xs gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit This Account</span>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer Account"
        description={`Are you sure you want to permanently delete "${selectedAccount?.Organization_Name}"? All linked subscriptions and user instances will be affected.`}
      />
    </div>
  );
}
