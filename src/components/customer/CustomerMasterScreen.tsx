'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { INITIAL_CUSTOMERS, CustomerRecord } from './customerData';

export function CustomerMasterScreen() {
  const router = useRouter();

  // State
  const [customers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [selectedProductFilter, setSelectedProductFilter] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [activeSubTab, setActiveSubTab] = useState('Customer List');

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
        return <GraduationCap className="h-4 w-4 text-[#6366f1]" />;
      case 'it':
        return <Laptop className="h-4 w-4 text-[#6366f1]" />;
      case 'retail':
        return <ShoppingCart className="h-4 w-4 text-[#6366f1]" />;
      case 'real-estate':
        return <Building2 className="h-4 w-4 text-[#6366f1]" />;
      case 'people':
      default:
        return <Users className="h-4 w-4 text-[#6366f1]" />;
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-10 font-sans text-slate-800 antialiased">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER BAR MATCHING IMAGE 4
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6366f1] border border-purple-100 shadow-xs">
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Customer Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage all customers, their details, subscriptions, products and status
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-500 font-medium">Product</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <GraduationCap className="h-4 w-4 text-[#6366f1]" />
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
            onClick={() => router.push('/customer/master/create')}
            className="bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. 5 KPI METRIC CARDS MATCHING IMAGE 4
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Total Customers */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl shrink-0">
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
          <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl shrink-0">
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
          <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total ARR</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">₹3.24 Cr</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. SUB-NAVIGATION TABS BAR MATCHING IMAGE 4
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
                  ? 'bg-[#6366f1] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-[#6366f1]')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. CUSTOMER LIST TABLE CARD MATCHING IMAGE 4
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        {/* Table Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#6366f1]" />
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
                placeholder="Search by customer name, domain, or contact..."
                className="pl-9 pr-3 py-1.5 text-xs h-9 bg-white border-slate-200 rounded-lg placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#6366f1]"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.info('Filters dialog')}
              className="h-9 px-3 text-xs bg-white border-slate-200 hover:bg-purple-50 hover:border-purple-200 text-[#6366f1] gap-1.5 rounded-lg shrink-0 font-semibold"
            >
              <Filter className="h-3.5 w-3.5 text-[#6366f1]" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Customer Records Table */}
        <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
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
                    className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-3.5 w-3.5 cursor-pointer accent-[#6366f1]"
                  />
                </th>
                <th className="py-2.5 px-2.5 w-8 text-center font-bold text-slate-900">#</th>
                <th className="py-2.5 px-3 font-bold text-slate-900">Customer Name</th>
                <th className="py-2.5 px-3 font-bold text-slate-900">Industry</th>
                <th className="py-2.5 px-3 font-bold text-slate-900">Product(s)</th>
                <th className="py-2.5 px-3 font-bold text-slate-900">Plan</th>
                <th className="py-2.5 px-3 font-bold text-slate-900">Start Date</th>
                <th className="py-2.5 px-3 font-bold text-slate-900">Next Renewal</th>
                <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-900">ARR (₹)</th>
                <th className="py-2.5 px-3 text-center w-24 font-bold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.map((cust, idx) => (
                <tr
                  key={cust.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/customer/overview?id=${cust.id}`)}
                >
                  <td
                    className="py-2.5 px-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomerIds.includes(cust.id)}
                      onChange={() => handleSelectOne(cust.id)}
                      className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-3.5 w-3.5 cursor-pointer accent-[#6366f1]"
                    />
                  </td>
                  <td className="py-2.5 px-2.5 text-center text-slate-500 font-semibold text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <span className="hover:text-[#6366f1] transition-colors">
                      {cust.name}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      {renderIndustryIcon(cust.industryIcon)}
                      <span>{cust.industry}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#ede9fe] text-[#6d28d9]">
                      {cust.product}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">
                    {cust.plan}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    {cust.startDate}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    {cust.nextRenewal}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold',
                        cust.status === 'Active' && 'bg-[#dcfce7] text-[#15803d]',
                        cust.status === 'Expiring' && 'bg-[#fef3c7] text-[#b45309]',
                        cust.status === 'Overdue' && 'bg-[#fee2e2] text-[#b91c1c]'
                      )}
                    >
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {cust.arr}
                  </td>
                  <td
                    className="py-2.5 px-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/customer/overview?id=${cust.id}`)}
                        title="View Customer Overview"
                        className="p-1 rounded-md text-[#6366f1] hover:bg-purple-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/customer/master/edit/${cust.id}`)}
                        title="Edit Customer"
                        className="p-1 rounded-md text-[#6366f1] hover:bg-purple-50 transition-colors"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. BOTTOM 3 CARDS MATCHING IMAGE 4
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: Customer Overview Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BarChart2 className="h-4.5 w-4.5 text-[#6366f1]" />
            <h4 className="text-sm font-bold text-slate-900">Customer Overview</h4>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            {/* SVG Donut Chart */}
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background ring */}
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Green Arc (95.8%) */}
                <path
                  className="text-emerald-500"
                  strokeDasharray="95.8, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Amber Arc (6.3%) */}
                <path
                  className="text-amber-500"
                  strokeDasharray="6.3, 100"
                  strokeDashoffset="-95.8"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Red Arc (1.4%) */}
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

        {/* Card 2: Products Adoption (Active Customers) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="h-4.5 w-4.5 text-[#6366f1]" />
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
                    <Icon className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                    <span className="truncate">{p.label}</span>
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#6366f1] h-full rounded-full transition-all duration-500"
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
            <Zap className="h-4.5 w-4.5 text-[#6366f1]" />
            <h4 className="text-sm font-bold text-slate-900">Quick Actions</h4>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/customer/subscription-management')}
              className="w-full h-9 text-xs font-semibold border-slate-200/90 hover:border-[#6366f1] hover:bg-purple-50/40 text-slate-800 justify-start gap-2.5 rounded-xl cursor-pointer"
            >
              <Users className="h-4 w-4 text-[#6366f1]" />
              <span>Manage Subscription</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/customer/renewals-expiry')}
              className="w-full h-9 text-xs font-semibold border-slate-200/90 hover:border-[#6366f1] hover:bg-purple-50/40 text-slate-800 justify-start gap-2.5 rounded-xl cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-[#6366f1]" />
              <span>Renewal Reminder</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/customer/usage')}
              className="w-full h-9 text-xs font-semibold border-slate-200/90 hover:border-[#6366f1] hover:bg-purple-50/40 text-slate-800 justify-start gap-2.5 rounded-xl cursor-pointer"
            >
              <BarChart2 className="h-4 w-4 text-[#6366f1]" />
              <span>View Usage</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.success('Customer list exported as CSV')}
              className="w-full h-9 text-xs font-semibold border-slate-200/90 hover:border-[#6366f1] hover:bg-purple-50/40 text-slate-800 justify-start gap-2.5 rounded-xl cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#6366f1]" />
              <span>Download Customer List</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
