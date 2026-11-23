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
  MoreVertical,
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
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { INITIAL_CUSTOMERS, CustomerRecord } from './customerData';

interface CustomerMasterScreenProps {
  initialMode?: 'edit_customer' | 'add_customer';
  initialCustomerId?: string;
  initialTab?: 'profile' | 'contact' | 'subscriptions' | 'sla';
}

export function CustomerMasterScreen({
  initialMode = 'edit_customer',
  initialCustomerId,
  initialTab = 'profile',
}: CustomerMasterScreenProps) {
  const router = useRouter();

  // State
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [selectedProductFilter, setSelectedProductFilter] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [activeSubTab, setActiveSubTab] = useState('Customer List');

  // Split Screen Drawer State (matching ProductMasterScreen layout)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerMode, setDrawerMode] = useState<'edit_customer' | 'add_customer'>(initialMode);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'profile' | 'contact' | 'subscriptions' | 'sla'>(initialTab);

  // Selected Customer ID
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(() => {
    return initialCustomerId || INITIAL_CUSTOMERS[0]?.id || 'cust-1';
  });

  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || customers[0] || INITIAL_CUSTOMERS[0];
  }, [customers, selectedCustomerId]);

  // Form State for Drawer
  const [formState, setFormState] = useState<Partial<CustomerRecord>>({
    ...selectedCustomer,
  });

  // Sync form when selected customer or mode changes
  useEffect(() => {
    if (drawerMode === 'edit_customer' && selectedCustomer) {
      setFormState({ ...selectedCustomer });
    }
  }, [selectedCustomer, drawerMode]);

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

  // Handle Save (Create or Update)
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name?.trim()) {
      toast.error('Please enter customer company name');
      return;
    }

    if (drawerMode === 'add_customer') {
      const newCustomer = {
        ...selectedCustomer,
        ...formState,
        id: formState.id || `cust-${Date.now()}`,
      } as CustomerRecord;

      setCustomers([newCustomer, ...customers]);
      setSelectedCustomerId(newCustomer.id);
      setDrawerMode('edit_customer');
      toast.success(`Customer "${newCustomer.name}" created successfully!`);
    } else {
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomerId ? ({ ...c, ...formState } as CustomerRecord) : c))
      );
      toast.success(`Customer "${formState.name}" updated successfully!`);
    }
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct =
        selectedProductFilter === 'All Products' ||
        c.product.toLowerCase() === selectedProductFilter.toLowerCase();

      return matchesSearch && matchesProduct;
    });
  }, [customers, searchQuery, selectedProductFilter]);

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
                <option value="All Products">All Products</option>
                <option value="Education">Education</option>
                <option value="IT">IT Services</option>
                <option value="Retail">Retail</option>
                <option value="Real Estate">Real Estate</option>
                <option value="People">People (HRMS)</option>
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
            onClick={() => toast.success('Customer list exported as CSV')}
            className="h-9 px-3 text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 rounded-lg font-semibold shadow-xs"
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
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">286</p>
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
              <span className="text-2xl font-extrabold text-slate-900">274</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                ↑ +8%
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
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">18</p>
          </div>
        </div>

        {/* Metric 4: Overdue */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Overdue</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">4</p>
          </div>
        </div>

        {/* Metric 5: Total ARR */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-2.5 bg-purple-50 text-[#5046e5] rounded-xl shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total ARR</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">₹3.24 Cr</p>
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
          { label: 'Documents', icon: FileText, path: '/customer/overview' },
          { label: 'Activity & History', icon: History, path: '/customer/overview' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.label;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                setActiveSubTab(tab.label);
                if (tab.label !== 'Customer List') {
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
          4. MAIN 2-COLUMN SPLIT LAYOUT (MATCHING PRODUCT MASTER EXACTLY)
             LEFT: CUSTOMERS TABLE LIST (~58% width when drawer open)
             RIGHT: INLINE CREATE / EDIT DETAILS DRAWER (~42% width)
      ══════════════════════════════════════════════════════════════════════ */}
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
                <h3 className="text-base font-bold text-slate-900">
                  Customers ({filteredCustomers.length > 5 ? '286' : filteredCustomers.length})
                </h3>
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
                                className="p-1 rounded-md text-[#5046e5] hover:bg-purple-50 transition-colors"
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
                                className="p-1 rounded-md text-[#5046e5] hover:bg-purple-50 transition-colors"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => toast.info(`Options for ${cust.name}`)}
                                title="More Options"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                    {drawerMode === 'add_customer' ? 'New Customer Account' : formState.name || selectedCustomer.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-slate-400">
                      {formState.customerId || selectedCustomer.customerId}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.2 rounded-full text-[10px] font-semibold',
                        (formState.status || 'Active') === 'Active'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#fef3c7] text-[#b45309]'
                      )}
                    >
                      {drawerMode === 'add_customer' ? 'Draft' : formState.status || selectedCustomer.status}
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
                        defaultValue="Ananya Sharma (VP Accounts)"
                        placeholder="Account executive"
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">SLA Tier</label>
                      <select
                        defaultValue="24/7 Mission-Critical Gold"
                        className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#5046e5]"
                      >
                        <option>24/7 Mission-Critical Gold</option>
                        <option>Priority 99.9% Silver</option>
                        <option>Standard Business Hours</option>
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
                      defaultValue="Strategic enterprise client with annual renewal ramp-up and multi-product fleet deployment."
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
                  className="h-8.5 px-4 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{drawerMode === 'add_customer' ? 'Create Customer' : 'Update Customer'}</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. BOTTOM 3 CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
        {/* Card 1: Customer Overview Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BarChart2 className="h-4.5 w-4.5 text-[#5046e5]" />
            <h4 className="text-sm font-bold text-slate-900">Customer Overview</h4>
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
                <path
                  className="text-emerald-500"
                  strokeDasharray="95.8, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500"
                  strokeDasharray="6.3, 100"
                  strokeDashoffset="-95.8"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-rose-500"
                  strokeDasharray="1.4, 100"
                  strokeDashoffset="-102.1"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900 leading-none">286</span>
                <span className="text-[10px] text-slate-500 font-medium">Customers</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
                <span className="text-slate-700 font-medium">Active (274) – 95.8%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-500 shrink-0" />
                <span className="text-slate-700 font-medium">Expiring (18) – 6.3%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-rose-500 shrink-0" />
                <span className="text-slate-700 font-medium">Overdue (4) – 1.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Products Adoption */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="h-4.5 w-4.5 text-[#5046e5]" />
            <h4 className="text-sm font-bold text-slate-900">
              Products Adoption (Active Customers)
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { label: 'Education', icon: GraduationCap, count: 112, pct: 100 },
              { label: 'IT', icon: Laptop, count: 64, pct: 57 },
              { label: 'Retail', icon: ShoppingCart, count: 46, pct: 41 },
              { label: 'Real Estate', icon: Building2, count: 32, pct: 28 },
              { label: 'People (HRMS)', icon: Users, count: 30, pct: 26 },
            ].map((p) => {
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
              onClick={() => toast.success('Customer list exported as CSV')}
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
