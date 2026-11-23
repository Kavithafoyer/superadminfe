'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  User,
  ShieldCheck,
  Server,
  Palette,
  Sliders,
  Check,
  ArrowLeft,
  Save,
  Globe,
  HardDrive,
  Users,
  Lock,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface TenantFormData {
  code: string;
  name: string;
  subdomain: string;
  industry: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  country: string;
  product: string;
  plan: string;
  userSeats: number;
  storageGb: number;
  cloudProvider: string;
  region: string;
  dedicatedDb: boolean;
  customSsl: boolean;
  tenantColor: string;
  tenantTag: string;
  status: 'Active' | 'Onboarding' | 'Suspended';
  dataRetentionYears: number;
  autoSuspension: boolean;
  maintenanceWindow: string;
}

const PRESET_COLORS = ['#6222cc', '#2563eb', '#0d9488', '#16a34a', '#d97706', '#9333ea', '#e11d48'];

const INITIAL_TENANT_FORM: TenantFormData = {
  code: 'TEN-00481',
  name: 'Euro Textiles Pvt Ltd',
  subdomain: 'eurotextiles.pegatto.app',
  industry: 'Textiles & Manufacturing',
  adminName: 'Vikram Patel',
  adminEmail: 'admin@eurotextiles.com',
  adminPhone: '+91 98765 43210',
  country: 'India (IST UTC+5:30)',
  product: 'Pegatto CRM',
  plan: 'Professional',
  userSeats: 25,
  storageGb: 50,
  cloudProvider: 'AWS (Amazon Web Services)',
  region: 'ap-south-1 (Mumbai)',
  dedicatedDb: true,
  customSsl: true,
  tenantColor: '#6222cc',
  tenantTag: 'Enterprise Tenant',
  status: 'Active',
  dataRetentionYears: 7,
  autoSuspension: true,
  maintenanceWindow: 'Sundays 02:00 - 04:00 AM IST',
};

export function TenantCreateScreen({
  mode = 'create',
  tenantId,
}: {
  mode?: 'create' | 'edit';
  tenantId?: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<TenantFormData>(() => {
    if (mode === 'edit') {
      return {
        ...INITIAL_TENANT_FORM,
        code: tenantId?.toUpperCase() || 'TEN-00481',
      };
    }
    return {
      code: '',
      name: '',
      subdomain: '',
      industry: 'Information Technology',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      country: 'India (IST UTC+5:30)',
      product: 'Pegatto CRM',
      plan: 'Standard',
      userSeats: 10,
      storageGb: 20,
      cloudProvider: 'AWS (Amazon Web Services)',
      region: 'ap-south-1 (Mumbai)',
      dedicatedDb: false,
      customSsl: true,
      tenantColor: '#6222cc',
      tenantTag: 'Standard Tenant',
      status: 'Onboarding',
      dataRetentionYears: 5,
      autoSuspension: true,
      maintenanceWindow: 'Sundays 02:00 - 04:00 AM IST',
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Please fill in Tenant Code and Organization Name.');
      return;
    }
    toast.success(
      mode === 'create'
        ? `Tenant "${formData.name}" provisioned successfully!`
        : `Tenant "${formData.name}" updated successfully!`
    );
    router.push('/tenant-management/all');
  };

  return (
    <div className="w-full space-y-6 pb-14 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/tenant-management/all')}
            >
              Tenant Management
            </span>
            <span className="text-slate-400">&gt;</span>
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/tenant-management/all')}
            >
              Tenants
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800 font-semibold">
              {mode === 'create' ? 'Create Tenant' : `Edit ${formData.code}`}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === 'create' ? 'Create & Provision Tenant' : `Edit Tenant: ${formData.name}`}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/tenant-management/all')}
            className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="h-9 px-5 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Save Tenant' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* CARD 1: TENANT ORGANIZATION INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#6222cc]">
              <Building2 className="h-4 w-4" />
            </span>
            <span>1. Tenant Organization Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Tenant Code <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. TEN-00481"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="h-9 text-xs uppercase font-medium"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700">
                Company Legal Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Euro Textiles Pvt Ltd"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Industry Vertical</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
              >
                <option>Textiles &amp; Manufacturing</option>
                <option>Information Technology</option>
                <option>Education &amp; Academics</option>
                <option>Retail &amp; E-commerce</option>
                <option>Healthcare &amp; Life Sciences</option>
                <option>Real Estate &amp; Construction</option>
              </select>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label className="font-semibold text-slate-700">
                Assigned Subdomain URL <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="h-9 px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-slate-500 text-xs flex items-center">
                  https://
                </span>
                <Input
                  placeholder="eurotextiles"
                  value={formData.subdomain.replace('.pegatto.app', '')}
                  onChange={(e) =>
                    setFormData({ ...formData, subdomain: `${e.target.value}.pegatto.app` })
                  }
                  className="rounded-none h-9 text-xs font-mono"
                  required
                />
                <span className="h-9 px-3 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg text-slate-500 text-xs flex items-center font-medium">
                  .pegatto.app
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: PRIMARY ADMINISTRATOR & CONTACT */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#6222cc]">
              <User className="h-4 w-4" />
            </span>
            <span>2. Primary Administrator &amp; Contact</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Admin Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Vikram Patel"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Admin Work Email <span className="text-rose-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="admin@eurotextiles.com"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Contact Phone Number</label>
              <Input
                placeholder="+91 98765 43210"
                value={formData.adminPhone}
                onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Country &amp; Timezone</label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: SUBSCRIPTION & PLAN SELECTION */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#6222cc]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>3. Product Subscription &amp; Plan Selection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Assigned Product</label>
              <select
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
              >
                <option>Pegatto CRM</option>
                <option>Pegatto Education</option>
                <option>Pegatto IT</option>
                <option>Pegatto Retail</option>
                <option>Pegatto People</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Plan Tier</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
              >
                <option>Standard</option>
                <option>Professional</option>
                <option>Enterprise</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">User Seats Quota</label>
              <Input
                type="number"
                min={1}
                value={formData.userSeats}
                onChange={(e) => setFormData({ ...formData, userSeats: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Cloud Storage Quota (GB)</label>
              <Input
                type="number"
                min={5}
                value={formData.storageGb}
                onChange={(e) => setFormData({ ...formData, storageGb: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: CLOUD INFRASTRUCTURE & REGION */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#6222cc]">
              <Server className="h-4 w-4" />
            </span>
            <span>4. Cloud Infrastructure &amp; Security</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Cloud Provider</label>
              <select
                value={formData.cloudProvider}
                onChange={(e) => setFormData({ ...formData, cloudProvider: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
              >
                <option>AWS (Amazon Web Services)</option>
                <option>Microsoft Azure</option>
                <option>Google Cloud Platform</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Deployment Region</label>
              <Input
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Dedicated Database</span>
                <span className="text-[11px] text-slate-400">Isolated database instance</span>
              </div>
              <input
                type="checkbox"
                checked={formData.dedicatedDb}
                onChange={(e) => setFormData({ ...formData, dedicatedDb: e.target.checked })}
                className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Auto-Renewed SSL</span>
                <span className="text-[11px] text-slate-400">Let's Encrypt Wildcard</span>
              </div>
              <input
                type="checkbox"
                checked={formData.customSsl}
                onChange={(e) => setFormData({ ...formData, customSsl: e.target.checked })}
                className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* CARD 5: TENANT COLOR & TAG */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#6222cc]">
              <Palette className="h-4 w-4" />
            </span>
            <span>5. Tenant Color &amp; Tag</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Tenant Accent Color</label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, tenantColor: c })}
                    style={{ backgroundColor: c }}
                    className={cn(
                      'h-7 w-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center',
                      formData.tenantColor === c
                        ? 'border-slate-900 scale-110 shadow-xs'
                        : 'border-white hover:scale-105'
                    )}
                  >
                    {formData.tenantColor === c && <Check className="h-3 w-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Tenant Classification Tag</label>
              <Input
                placeholder="e.g. Enterprise Tenant"
                value={formData.tenantTag}
                onChange={(e) => setFormData({ ...formData, tenantTag: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Initial Lifecycle Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
              >
                <option value="Active">Active (Provision &amp; Launch)</option>
                <option value="Onboarding">Onboarding (Pending Setup)</option>
                <option value="Suspended">Suspended (Hold Access)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD 6: GOVERNANCE & POLICIES */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#6222cc]">
              <Sliders className="h-4 w-4" />
            </span>
            <span>6. Governance &amp; Compliance Policies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Data Retention Period (Years)</label>
              <Input
                type="number"
                min={1}
                max={20}
                value={formData.dataRetentionYears}
                onChange={(e) => setFormData({ ...formData, dataRetentionYears: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Maintenance Schedule Window</label>
              <Input
                value={formData.maintenanceWindow}
                onChange={(e) => setFormData({ ...formData, maintenanceWindow: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Auto-Suspension Rule</span>
                <span className="text-[11px] text-slate-400">Suspend on &gt;30d overdue</span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoSuspension}
                onChange={(e) => setFormData({ ...formData, autoSuspension: e.target.checked })}
                className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/tenant-management/all')}
            className="h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-9 px-5 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Save Tenant' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
