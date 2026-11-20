'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  entitlements: {
    feature: string;
    status: 'Enabled' | 'Disabled';
    quota: string;
  }[];
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

export function LicenseEntitlementsScreen() {
  const router = useRouter();

  // Active top tab
  const [activeTab, setActiveTab] = useState<'licenses' | 'entitlements' | 'assignments' | 'compliance' | 'renewals'>('licenses');

  // Licenses state
  const [licenses, setLicenses] = useState<LicenseItem[]>(INITIAL_LICENSES);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>('lic-1');

  // Filters
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterTenant, setFilterTenant] = useState('All Tenants');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedLicense = licenses.find((l) => l.id === selectedLicenseId) || licenses[0];

  const handleIssueLicense = () => {
    toast.info('Opening Issue License modal');
  };

  const handleExport = () => {
    toast.success('Licenses exported to CSV');
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

      {/* 2. HEADER */}
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
          onClick={handleIssueLicense}
          className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Issue License</span>
        </Button>
      </div>

      {/* 3. STAT CARDS */}
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

      {/* 4. TABS */}
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
                  ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

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
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
                >
                  <option value="All Products">All Products</option>
                  <option value="Pegatto CRM">Pegatto CRM</option>
                  <option value="Pegatto Education">Pegatto Education</option>
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
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
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
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Expiring">Expiring</option>
                  <option value="Suspended">Suspended</option>
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
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
                >
                  <option value="All Tenants">All Tenants</option>
                  <option value="Euro Textiles">Euro Textiles</option>
                  <option value="Sunrise School">Sunrise School</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={() => toast.info('Filters reset')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <Button
              type="button"
              onClick={() => toast.success('License filters applied')}
              className="bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs h-9 px-4 rounded-lg font-medium shadow-2xs"
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
                onClick={() => toast.info('Column setup')}
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
                      <input type="checkbox" className="rounded border-slate-300 text-[#1574fe] h-3.5 w-3.5" />
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
                  {licenses.map((lic) => {
                    const isSelected = selectedLicenseId === lic.id;
                    return (
                      <tr
                        key={lic.id}
                        onClick={() => setSelectedLicenseId(lic.id)}
                        className={cn(
                          'transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-[#edf5ff] border-l-2 border-l-[#1574fe]'
                            : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSelectedLicenseId(lic.id)}
                            className="rounded border-slate-300 text-[#1574fe] h-3.5 w-3.5"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-[#1574fe] underline decoration-[#1574fe]/40 whitespace-nowrap">
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
                                ? 'bg-emerald-100 text-emerald-700'
                                : lic.status === 'Expiring'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            )}
                          >
                            {lic.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => toast.info(`Edit ${lic.licenseKey}`)}
                              className="p-1 rounded text-slate-400 hover:text-[#1574fe] hover:bg-slate-100"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Options for ${lic.licenseKey}`)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
              <div>Showing 1-{licenses.length} of 2,480 licenses</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <select className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium">
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">«</button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&lt;</button>
                  <button type="button" className="h-6 w-6 rounded bg-[#1574fe] text-white font-semibold text-xs flex items-center justify-center shadow-xs">1</button>
                  <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">2</button>
                  <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">3</button>
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
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
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
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{ent.feature}</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-200/60">
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
                onClick={() => toast.warning(`Suspended license ${selectedLicense.licenseKey}`)}
                className="text-xs h-9 px-2 text-slate-700"
              >
                Suspend
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.error(`Revoked license ${selectedLicense.licenseKey}`)}
                className="text-xs h-9 px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Revoke
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.success(`License validity extended by 30 days`)}
                className="text-xs h-9 px-2 text-slate-700"
              >
                Extend
              </Button>
              <Button
                type="button"
                onClick={() => toast.info('Edit Entitlements dialog')}
                className="bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs h-9 px-2 font-semibold"
              >
                Edit Entitlements
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
