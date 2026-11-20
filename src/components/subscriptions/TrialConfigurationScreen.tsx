'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Edit2,
  MoreVertical,
  X,
  Check,
  CheckCircle2,
  Layers,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface TrialPlanItem {
  id: string;
  name: string;
  product: string;
  edition: string;
  durationDays: number;
  featuresSummary: string;
  status: 'Active' | 'Draft' | 'Inactive';
  featureScope: 'all' | 'select';
  enabledFeatures: string[];
  allowConversion: boolean;
  retainData: boolean;
  autoExpire: boolean;
  userLimit: number;
  storageLimit: number;
}

const INITIAL_TRIALS: TrialPlanItem[] = [
  {
    id: 'tr-1',
    name: 'CRM Trial (Standard)',
    product: 'Pegatto CRM',
    edition: 'Standard',
    durationDays: 14,
    featuresSummary: 'Core + Limited AI',
    status: 'Active',
    featureScope: 'select',
    enabledFeatures: [
      'Lead Management',
      'Contact Management',
      'Deals & Pipeline',
      'Reports & Analytics',
      'AI Lead Scoring (Limited)',
    ],
    allowConversion: true,
    retainData: true,
    autoExpire: false,
    userLimit: 10,
    storageLimit: 5,
  },
  {
    id: 'tr-2',
    name: 'CRM Trial (Professional)',
    product: 'Pegatto CRM',
    edition: 'Professional',
    durationDays: 30,
    featuresSummary: 'All Professional',
    status: 'Active',
    featureScope: 'all',
    enabledFeatures: ['All Professional Features', 'Workflow Automation', 'Advanced AI'],
    allowConversion: true,
    retainData: true,
    autoExpire: true,
    userLimit: 25,
    storageLimit: 15,
  },
  {
    id: 'tr-3',
    name: 'Education Trial',
    product: 'Pegatto Education',
    edition: 'Standard',
    durationDays: 14,
    featuresSummary: 'Core Features',
    status: 'Active',
    featureScope: 'select',
    enabledFeatures: ['Student Management', 'Attendance', 'Class Schedules'],
    allowConversion: true,
    retainData: true,
    autoExpire: false,
    userLimit: 15,
    storageLimit: 10,
  },
  {
    id: 'tr-4',
    name: 'IT Service Trial',
    product: 'Pegatto IT',
    edition: 'Standard',
    durationDays: 21,
    featuresSummary: 'ITSM + Assets',
    status: 'Active',
    featureScope: 'select',
    enabledFeatures: ['Service Desk', 'Asset Tracking', 'Incident SLAs'],
    allowConversion: true,
    retainData: true,
    autoExpire: false,
    userLimit: 20,
    storageLimit: 10,
  },
  {
    id: 'tr-5',
    name: 'People Trial',
    product: 'Pegatto People',
    edition: 'Standard',
    durationDays: 14,
    featuresSummary: 'HR Core + Reports',
    status: 'Draft',
    featureScope: 'select',
    enabledFeatures: ['Employee Directory', 'Leave Tracking', 'Basic Payroll'],
    allowConversion: true,
    retainData: false,
    autoExpire: true,
    userLimit: 10,
    storageLimit: 5,
  },
  {
    id: 'tr-6',
    name: 'Retail Trial',
    product: 'Pegatto Retail',
    edition: 'Professional',
    durationDays: 30,
    featuresSummary: 'All Professional',
    status: 'Active',
    featureScope: 'all',
    enabledFeatures: ['POS Registers', 'Inventory Management', 'Barcode Scanning'],
    allowConversion: true,
    retainData: true,
    autoExpire: false,
    userLimit: 15,
    storageLimit: 10,
  },
];

export function TrialConfigurationScreen() {
  const router = useRouter();

  // Active top tab
  const [activeTab, setActiveTab] = useState<'plans' | 'rules' | 'conversion' | 'notifications'>('plans');

  // Trials State
  const [trials, setTrials] = useState<TrialPlanItem[]>(INITIAL_TRIALS);
  const [selectedTrialId, setSelectedTrialId] = useState<string>('tr-1');

  // Selected Trial for Form
  const selectedTrial = trials.find((t) => t.id === selectedTrialId) || trials[0];
  const [formData, setFormData] = useState<TrialPlanItem>({ ...selectedTrial });

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectRow = (trial: TrialPlanItem) => {
    setSelectedTrialId(trial.id);
    setFormData({ ...trial });
  };

  const handleRemoveFeature = (feat: string) => {
    setFormData({
      ...formData,
      enabledFeatures: formData.enabledFeatures.filter((f) => f !== feat),
    });
  };

  const handleUpdateTrial = () => {
    setTrials((prev) => prev.map((t) => (t.id === formData.id ? { ...formData } : t)));
    toast.success(`Trial plan "${formData.name}" updated successfully!`);
  };

  const handleCreateNew = () => {
    const newTr: TrialPlanItem = {
      id: `tr-${Date.now()}`,
      name: 'Custom Product Trial',
      product: 'Pegatto CRM',
      edition: 'Standard',
      durationDays: 14,
      featuresSummary: 'Core Features',
      status: 'Draft',
      featureScope: 'select',
      enabledFeatures: ['Core CRM', 'Lead Management'],
      allowConversion: true,
      retainData: true,
      autoExpire: false,
      userLimit: 10,
      storageLimit: 5,
    };
    setTrials([newTr, ...trials]);
    setSelectedTrialId(newTr.id);
    setFormData(newTr);
    toast.success('New trial configuration initialized');
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push('/products/master')}>
          Product Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Trial Configuration</span>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Trial Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Define and manage trial plans, duration, features, and conversion rules for each product and edition.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleCreateNew}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Trial Plan</span>
        </Button>
      </div>

      {/* 3. STAT CARDS (4 Cards matching Image 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Trial Plans */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Calendar className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Trial Plans</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">6</h3>
          </div>
        </div>

        {/* Trials in Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Users className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Trials in Progress</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">1,284</h3>
          </div>
        </div>

        {/* Trial Conversions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/70 shrink-0">
            <TrendingUp className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Trial Conversions</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">68%</h3>
          </div>
        </div>

        {/* Average Trial Duration */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100/70 shrink-0">
            <Clock className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Average Trial Duration</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">14 Days</h3>
          </div>
        </div>
      </div>

      {/* 4. TABS */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          {[
            { id: 'plans', label: 'Trial Plans' },
            { id: 'rules', label: 'Trial Rules' },
            { id: 'conversion', label: 'Conversion Settings' },
            { id: 'notifications', label: 'Email & Notifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'pb-3 font-semibold transition-all relative cursor-pointer',
                activeTab === tab.id
                  ? 'text-[#4F46E5] border-b-2 border-[#4F46E5] -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 5. TWO-COLUMN LAYOUT: TABLE (LEFT) & FORM (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: TRIAL PLANS TABLE (6 COLS) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-base font-bold text-slate-900">
              Trial Plans ({trials.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trial plan, product or edition..."
                className="pl-9 h-9 text-xs rounded-xl border-slate-200/90 bg-white"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Trial plan filters')}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
            >
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <span>Filters</span>
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                    <th className="py-3 px-3 w-8 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5" />
                    </th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Plan Name</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Product</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Edition</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Trial Duration</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Features</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trials.map((tr) => {
                    const isSelected = selectedTrialId === tr.id;
                    return (
                      <tr
                        key={tr.id}
                        onClick={() => handleSelectRow(tr)}
                        className={cn(
                          'transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-[#f6f4fe] border-l-2 border-l-[#4F46E5]'
                            : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(tr)}
                            className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                          />
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {tr.name}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {tr.product}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {tr.edition}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                          {tr.durationDays} Days
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {tr.featuresSummary}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              tr.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {tr.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSelectRow(tr)}
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Options for ${tr.name}`)}
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
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium">
                  <option>10</option>
                  <option>25</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span>1-6 of 6</span>
                <div className="flex items-center gap-1">
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&lt;</button>
                  <button type="button" className="h-6 w-6 rounded bg-[#4F46E5] text-white font-semibold text-xs flex items-center justify-center shadow-xs">1</button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&gt;</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRIAL PLAN CONFIGURATION FORM (6 COLS) */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Trial Plan Configuration</h3>
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {formData.status}
              </span>
            </div>

            {/* SECTION 1: Basic Information */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-xs text-[#4F46E5]">Basic Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Trial Plan Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Product *</label>
                  <div className="relative">
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800"
                    >
                      <option value="Pegatto CRM">Pegatto CRM</option>
                      <option value="Pegatto Education">Pegatto Education</option>
                      <option value="Pegatto IT">Pegatto IT</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Edition *</label>
                  <div className="relative">
                    <select
                      value={formData.edition}
                      onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Professional">Professional</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Trial Duration *</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                      className="text-xs h-9 pr-14"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Trial Access & Features */}
            <div className="space-y-3 text-xs pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs text-[#4F46E5]">Trial Access &amp; Features</h4>

              <div className="space-y-2">
                <label className="font-semibold text-slate-700">Feature Scope *</label>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      checked={formData.featureScope === 'all'}
                      onChange={() => setFormData({ ...formData, featureScope: 'all' })}
                      className="text-indigo-600"
                    />
                    <span className="text-slate-700 text-xs">All Edition Features</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      checked={formData.featureScope === 'select'}
                      onChange={() => setFormData({ ...formData, featureScope: 'select' })}
                      className="text-indigo-600"
                    />
                    <span className="text-slate-700 text-xs font-semibold">Select Features</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">
                  Enabled Features ({formData.enabledFeatures.length})
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl min-h-[44px]">
                  {formData.enabledFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-[#f6f4fe] text-[#4F46E5] text-[11px] font-medium px-2.5 py-1 rounded-lg border border-purple-200/60"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feat)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: Conversion & Limits */}
            <div className="space-y-3 text-xs pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs text-[#4F46E5]">Conversion &amp; Limits</h4>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowConversion}
                    onChange={(e) => setFormData({ ...formData, allowConversion: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                  />
                  <span className="text-slate-700 text-xs">Allow conversion to paid plan after trial</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.retainData}
                    onChange={(e) => setFormData({ ...formData, retainData: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                  />
                  <span className="text-slate-700 text-xs">Retain trial data on conversion</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoExpire}
                    onChange={(e) => setFormData({ ...formData, autoExpire: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                  />
                  <span className="text-slate-700 text-xs">Auto-expire trial (deactivate access)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">User Limit</label>
                  <Input
                    type="number"
                    value={formData.userLimit}
                    onChange={(e) => setFormData({ ...formData, userLimit: Number(e.target.value) })}
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Storage Limit</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={formData.storageLimit}
                      onChange={(e) => setFormData({ ...formData, storageLimit: Number(e.target.value) })}
                      className="text-xs h-9 pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">GB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...selectedTrial })}
                className="text-xs h-9"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.info('Saved trial draft')}
                  className="text-xs h-9"
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateTrial}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs h-9 px-4 font-semibold"
                >
                  Update Trial Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
