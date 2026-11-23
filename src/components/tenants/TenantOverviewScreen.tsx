'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Server,
  ShieldCheck,
  User,
  HardDrive,
  Globe,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  Check,
  Users,
  CreditCard,
  Mail,
  Phone,
  Clock,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TenantOverviewScreen({ tenantId }: { tenantId: string }) {
  const router = useRouter();

  const tenant = {
    code: tenantId?.toUpperCase() || 'TEN-00481',
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
    activeUsers: 22,
    storageGb: 50,
    storageUsedGb: 34.2,
    cloudProvider: 'AWS (Amazon Web Services)',
    region: 'ap-south-1 (Mumbai)',
    dedicatedDb: 'Enabled (PostgreSQL 16)',
    sslStatus: 'Active & Auto-Renewed',
    tenantColor: '#6222cc',
    tenantTag: 'Enterprise Tenant',
    status: 'Active',
    dataRetentionYears: 7,
    autoSuspension: 'Active (30 Days Grace)',
    maintenanceWindow: 'Sundays 02:00 - 04:00 AM IST',
    since: '01 Oct 2025',
    nextRenewal: '30 Sep 2026',
    annualValue: '₹49,999 / year',
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
            <span className="text-slate-800 font-semibold">{tenant.code}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tenant Overview: {tenant.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {tenant.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/tenant-management/all')}
            className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`/tenant-management/edit/${tenantId}`)}
            className="h-9 px-4 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Tenant
          </Button>
        </div>
      </div>

      {/* 2. TOP HIGHLIGHT KPI CARDS (MATCHING REFERENCE IMAGE 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Tenant Code
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{tenant.code}</div>
            <div className="text-xs text-[#6222cc] font-semibold mt-0.5">{tenant.subdomain}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#6222cc] flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              User Seats
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {tenant.activeUsers} / {tenant.userSeats} Seats
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">88% Quota Utilized</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#6222cc] flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Cloud Storage
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {tenant.storageUsedGb} / {tenant.storageGb} GB
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{tenant.cloudProvider.split(' ')[0]} Cloud</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Subscription
            </div>
            <div className="text-lg font-bold text-[#6222cc] mt-1">{tenant.plan}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{tenant.annualValue}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN STRUCTURED DETAILS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT CARD: TENANT ORGANIZATION PROFILE */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#6222cc]">
              <Building2 className="h-4 w-4" />
            </span>
            <span>Tenant Organization Information</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Tenant Code</span>
              <span className="font-semibold text-slate-900 text-sm">{tenant.code}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Industry</span>
              <span className="font-semibold text-slate-800">{tenant.industry}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Subdomain</span>
              <span className="font-mono text-[#6222cc] font-semibold">{tenant.subdomain}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Classification Tag</span>
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                {tenant.tenantTag}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Administrator</span>
              <span className="font-semibold text-slate-800">{tenant.adminName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Admin Email</span>
              <span className="text-slate-700">{tenant.adminEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Phone Contact</span>
              <span className="text-slate-700">{tenant.adminPhone}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Region &amp; Timezone</span>
              <span className="text-slate-700">{tenant.country}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Tenant Since</span>
              <span className="text-slate-700">{tenant.since}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Next Renewal</span>
              <span className="font-semibold text-slate-900">{tenant.nextRenewal}</span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: CLOUD INFRASTRUCTURE & SECURITY */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#6222cc]">
              <Server className="h-4 w-4" />
            </span>
            <span>Cloud Infrastructure &amp; Security</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Assigned Product</span>
              <span className="font-semibold text-slate-900">{tenant.product}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Plan Tier</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#6222cc] font-semibold text-[11px] border border-blue-100">
                {tenant.plan}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Cloud Provider</span>
              <span className="font-medium text-slate-800">{tenant.cloudProvider}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Deployment Region</span>
              <span className="text-slate-800 font-mono">{tenant.region}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Database Isolation</span>
              <span className="font-semibold text-slate-800">{tenant.dedicatedDb}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">SSL Status</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="h-3 w-3" /> {tenant.sslStatus}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Data Retention</span>
              <span className="font-semibold text-slate-800">{tenant.dataRetentionYears} Years</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Auto-Suspension Rule</span>
              <span className="text-slate-700">{tenant.autoSuspension}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-100">
              <span className="text-slate-400 font-medium block text-[11px] mb-1">
                Maintenance Schedule Window
              </span>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{tenant.maintenanceWindow}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
