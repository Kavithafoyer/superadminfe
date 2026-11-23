'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ShieldCheck,
  Database,
  Gavel,
  Clock,
  Download,
  Trash2,
  FileText,
  Settings,
  Info,
  Check,
  CheckCircle2,
  Users,
  Edit2,
  Eye,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  INITIAL_TENANT_RETENTION_SETTINGS,
  INITIAL_POLICY_VERSIONS,
  TenantRetentionSetting,
  PolicyVersionRecord,
} from './tenantData';

export function TenantRetentionPolicyScreen() {
  const router = useRouter();

  // Sub Tab state
  const [activeTab, setActiveTab] = useState<'export' | 'deletion' | 'history' | 'data-retention' | 'policy'>('policy');

  // Policy configuration
  const [retentionPeriod, setRetentionPeriod] = useState('5 Years (Recommended)');
  const [dataCategories, setDataCategories] = useState('All Data (Users, Business, Documents, Logs)');
  const [postRetentionAction, setPostRetentionAction] = useState<'permanent' | 'archive'>('permanent');
  const [gracePeriodDays, setGracePeriodDays] = useState(30);

  // Policy rules checkboxes
  const [applyExisting, setApplyExisting] = useState(true);
  const [applyNew, setApplyNew] = useState(true);
  const [retainAuditLogs, setRetainAuditLogs] = useState(true);
  const [allowOverride, setAllowOverride] = useState(false);
  const [notifyTenant, setNotifyTenant] = useState(false);
  const [generateReports, setGenerateReports] = useState(true);

  // Data
  const [tenantRetentionList] = useState<TenantRetentionSetting[]>(INITIAL_TENANT_RETENTION_SETTINGS);
  const [policyVersions] = useState<PolicyVersionRecord[]>(INITIAL_POLICY_VERSIONS);

  const handleTabChange = (key: 'export' | 'deletion' | 'history' | 'data-retention' | 'policy') => {
    setActiveTab(key);
    if (key === 'export' || key === 'deletion' || key === 'history') {
      router.push(`/tenant-management/export-deletion?tab=${key}`);
    }
  };

  const handleSaveChanges = () => {
    toast.success('Retention & compliance policies saved successfully!');
  };

  const handleReset = () => {
    setRetentionPeriod('5 Years (Recommended)');
    setPostRetentionAction('permanent');
    setGracePeriodDays(30);
    toast.info('Retention policy reset to platform defaults.');
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-10">
      {/* Header matching Image 1 */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shadow-xs">
          <Shield className="h-7 w-7 text-[#6222cc]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Retention & Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Define data retention, export, deletion and compliance policies for all tenants
          </p>
        </div>
      </div>

      {/* Top Navigation Tabs matching Image 1 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'export', label: 'Data Export', icon: Download },
          { key: 'deletion', label: 'Data Deletion', icon: Trash2 },
          { key: 'history', label: 'Export & Deletion History', icon: Clock },
          { key: 'data-retention', label: 'Data Retention Policy', icon: Database },
          { key: 'policy', label: 'Retention & Policy', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key as any)}
              className={cn(
                'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs',
                isActive
                  ? 'bg-[#6366f1] text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-slate-700')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top 4 Metric KPI Cards matching Image 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Default Retention */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Database className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Default Retention</span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              5 Years
            </div>
          </div>
        </div>

        {/* Policy Coverage */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#6222cc] shrink-0">
            <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Policy Coverage</span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              All Tenants
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Gavel className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Compliance</span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              GDPR / DPDP
            </div>
          </div>
        </div>

        {/* Last Policy Update */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#6222cc] shrink-0">
            <Shield className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Last Policy Update</span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              15 Nov 2026
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: 3 Policy Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1: Retention Policy Configuration (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Settings className="h-4 w-4 text-[#6222cc]" />
            <h3 className="text-sm font-bold text-slate-900">Retention Policy Configuration</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Retention Period <span className="text-red-500">*</span>
            </label>
            <select
              value={retentionPeriod}
              onChange={(e) => setRetentionPeriod(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-hidden"
            >
              <option value="1 Year">1 Year</option>
              <option value="3 Years">3 Years</option>
              <option value="5 Years (Recommended)">5 Years (Recommended)</option>
              <option value="7 Years">7 Years</option>
              <option value="10 Years">10 Years</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Data Categories <span className="text-red-500">*</span>
            </label>
            <select
              value={dataCategories}
              onChange={(e) => setDataCategories(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-hidden"
            >
              <option value="All Data (Users, Business, Documents, Logs)">
                All Data (Users, Business, Documents, Logs)
              </option>
              <option value="User Data & Documents Only">User Data & Documents Only</option>
              <option value="Transactions & Invoices Only">Transactions & Invoices Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Post-Retention Action <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="postRetentionAction"
                  checked={postRetentionAction === 'permanent'}
                  onChange={() => setPostRetentionAction('permanent')}
                  className="mt-0.5 accent-indigo-600"
                />
                <div>
                  <div className="font-semibold text-slate-800">Permanent Deletion</div>
                  <div className="text-[11px] text-slate-500">
                    Permanently and irreversibly delete data
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="postRetentionAction"
                  checked={postRetentionAction === 'archive'}
                  onChange={() => setPostRetentionAction('archive')}
                  className="mt-0.5 accent-indigo-600"
                />
                <div>
                  <div className="font-semibold text-slate-800">Archive & Delete</div>
                  <div className="text-[11px] text-slate-500">
                    Archive for read-only access, then delete
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
              <span>Grace Period (Optional)</span>
              <Info className="h-3 w-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Input
                type="number"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="w-16 h-7 text-xs text-center font-bold"
              />
              <span className="text-xs text-slate-500">days (before permanent deletion)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Policy Rules (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <FileText className="h-4 w-4 text-[#6222cc]" />
            <h3 className="text-sm font-bold text-slate-900">Policy Rules</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={applyExisting}
                onChange={(e) => setApplyExisting(e.target.checked)}
                className="rounded border-slate-300 text-[#6222cc] accent-indigo-600"
              />
              <span>Apply policy to all existing tenants</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={applyNew}
                onChange={(e) => setApplyNew(e.target.checked)}
                className="rounded border-slate-300 text-[#6222cc] accent-indigo-600"
              />
              <span>Automatically apply to new tenants</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={retainAuditLogs}
                onChange={(e) => setRetainAuditLogs(e.target.checked)}
                className="rounded border-slate-300 text-[#6222cc] accent-indigo-600"
              />
              <span className="flex items-center gap-1">
                Retain audit logs for compliance (7 Years)
                <Info className="h-3 w-3 text-slate-400" />
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
              <input
                type="checkbox"
                checked={allowOverride}
                onChange={(e) => setAllowOverride(e.target.checked)}
                className="rounded border-slate-300 text-[#6222cc] accent-indigo-600"
              />
              <span className="flex items-center gap-1">
                Allow tenant-specific retention override
                <Info className="h-3 w-3 text-slate-400" />
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
              <input
                type="checkbox"
                checked={notifyTenant}
                onChange={(e) => setNotifyTenant(e.target.checked)}
                className="rounded border-slate-300 text-[#6222cc] accent-indigo-600"
              />
              <span className="flex items-center gap-1">
                Notify tenant before data deletion
                <Info className="h-3 w-3 text-slate-400" />
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={generateReports}
                onChange={(e) => setGenerateReports(e.target.checked)}
                className="rounded border-slate-300 text-[#6222cc] accent-indigo-600"
              />
              <span>Generate deletion reports and audit trails</span>
            </label>
          </div>
        </div>

        {/* Card 3: Compliance & Governance (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <ShieldCheck className="h-4 w-4 text-[#6222cc]" />
            <h3 className="text-sm font-bold text-slate-900">Compliance & Governance</h3>
          </div>

          <div className="space-y-3 pt-1 text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span>GDPR (EU) – Compliant</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span>DPDP (India) – Compliant</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span>Data Minimization – Enabled</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span>Right to Erasure – Supported</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span>Audit Trail – Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Tenant-Specific Retention Settings + Policy Version & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 4: Tenant-Specific Retention Settings (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
          <div className="flex items-center gap-2 p-3.5 border-b border-slate-100">
            <Users className="h-4 w-4 text-[#6222cc]" />
            <h3 className="text-sm font-bold text-slate-900">Tenant-Specific Retention Settings</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">Tenant Name</th>
                  <th className="py-2.5 px-3">Data Retention</th>
                  <th className="py-2.5 px-3">Post-Retention Action</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {tenantRetentionList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.tenantName}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{item.dataRetention}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.postRetentionAction}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-2 text-[#6222cc]">
                        <button
                          type="button"
                          onClick={() => toast.info(`Editing settings for ${item.tenantName}`)}
                          className="hover:text-[#521cb0]"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info(`Viewing details for ${item.tenantName}`)}
                          className="hover:text-[#521cb0]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 5: Policy Version & History (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
          <div className="flex items-center gap-2 p-3.5 border-b border-slate-100">
            <RefreshCw className="h-4 w-4 text-[#6222cc]" />
            <h3 className="text-sm font-bold text-slate-900">Policy Version & History</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Version</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Updated By</th>
                  <th className="py-2.5 px-3">Updated On</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {policyVersions.map((pv) => (
                  <tr key={pv.version} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{pv.version}</td>
                    <td className="py-2.5 px-3 text-slate-700">{pv.description}</td>
                    <td className="py-2.5 px-3 text-slate-600">{pv.updatedBy}</td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{pv.updatedOn}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap',
                          pv.status === 'Current'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : pv.status === 'Published'
                            ? 'bg-blue-50 text-[#6222cc] border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        )}
                      >
                        {pv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info('Opening official policy document PDF...')}
          className="text-xs sm:text-sm font-semibold text-slate-700 border-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <FileText className="h-4 w-4" />
          <span>View Policy Document</span>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="text-xs sm:text-sm font-semibold text-slate-700 border-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Default</span>
          </Button>

          <Button
            type="button"
            onClick={handleSaveChanges}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
