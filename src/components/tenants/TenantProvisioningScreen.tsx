'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Cloud,
  Check,
  CheckCircle2,
  Info,
  Server,
  Layers,
  Database,
  Sliders,
  Shield,
  FileText,
  Clock,
  ArrowLeft,
  Rocket,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TenantProvisioningScreen() {
  const router = useRouter();

  // Stepper state
  const [currentStep, setCurrentStep] = useState(3);

  // Form states matching image 2
  const [environmentType, setEnvironmentType] = useState<'Production' | 'Staging' | 'Development'>('Production');
  const [cloudHosting, setCloudHosting] = useState('AWS (India - Mumbai)');
  const [compute, setCompute] = useState('4 vCPU');
  const [memory, setMemory] = useState('16 GB');
  const [storage, setStorage] = useState('200 GB (SSD)');
  const [database, setDatabase] = useState('PostgreSQL (Managed)');

  // Tenant Setup Options
  const [createAdminUser, setCreateAdminUser] = useState(true);
  const [provisionRoles, setProvisionRoles] = useState(true);
  const [enableWorkflows, setEnableWorkflows] = useState(true);
  const [importInitialData, setImportInitialData] = useState(false);

  // Configuration Toggles
  const [enableSSO, setEnableSSO] = useState(true);
  const [customDomainEnabled, setCustomDomainEnabled] = useState(true);
  const [customDomain, setCustomDomain] = useState('brightfuture.pegatto.in');
  const [enableSMTP, setEnableSMTP] = useState(true);
  const [enableWhatsApp, setEnableWhatsApp] = useState(false);
  const [enableOtherIntegrations, setEnableOtherIntegrations] = useState(false);

  // Security & Compliance
  const [enableEncryption, setEnableEncryption] = useState(true);
  const [enableAuditLogs, setEnableAuditLogs] = useState(true);
  const [enableGDPR, setEnableGDPR] = useState(true);
  const [enableBackup, setEnableBackup] = useState(true);

  const handleSaveDraft = () => {
    toast.info('Provisioning configuration saved as draft.');
  };

  const handleProvisionTenant = () => {
    toast.success('Tenant provisioning initiated! Estimated completion in 10-15 minutes.');
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-10">
      {/* Header Bar matching Image 2 */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shadow-xs">
          <Cloud className="h-7 w-7 text-[#6222cc]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Tenant Provisioning
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, configure and provision tenant environments for customers
          </p>
        </div>
      </div>

      {/* 4-Step Stepper Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800">Tenant Details</span>
            <div className="hidden md:block flex-1 h-0.5 bg-emerald-300 ml-2" />
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800">Product & Plan</span>
            <div className="hidden md:block flex-1 h-0.5 bg-blue-400 ml-2" />
          </div>

          {/* Step 3 (Active) */}
          <div className="flex items-center gap-2.5 bg-blue-50/70 border border-blue-200/80 rounded-lg px-2.5 py-1">
            <div className="h-7 w-7 rounded-full bg-[#6222cc] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              3
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#521cb0]">
              Resources & Configuration
            </span>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-2.5 opacity-60">
            <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-semibold text-xs shrink-0">
              4
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-600">Review & Provision</span>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="pt-1">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          3. Resources & Configuration
        </h2>
      </div>

      {/* 3-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ================= COLUMN 1 (Left: 4 cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Environment & Resources */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Layers className="h-4 w-4 text-[#6222cc]" />
              <h3 className="text-sm font-bold text-slate-900">Environment & Resources</h3>
            </div>

            {/* Environment Type Radio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Environment Type <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                {(['Production', 'Staging', 'Development'] as const).map((env) => (
                  <label key={env} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="envType"
                      checked={environmentType === env}
                      onChange={() => setEnvironmentType(env)}
                      className="text-[#6222cc] focus:ring-[#6222cc] h-3.5 w-3.5 accent-indigo-600"
                    />
                    <span>{env}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cloud / Hosting */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <label className="text-xs font-semibold text-slate-700">Cloud / Hosting</label>
                <span className="text-red-500 text-xs">*</span>
                <Info className="h-3 w-3 text-slate-400" />
              </div>
              <div className="relative">
                <select
                  value={cloudHosting}
                  onChange={(e) => setCloudHosting(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#6222cc] outline-hidden"
                >
                  <option value="AWS (India - Mumbai)">AWS (India - Mumbai)</option>
                  <option value="AWS (US - East)">AWS (US - East)</option>
                  <option value="Google Cloud (India - Delhi)">Google Cloud (India - Delhi)</option>
                  <option value="Azure (Central India)">Azure (Central India)</option>
                </select>
              </div>
            </div>

            {/* Compute (vCPU) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Compute (vCPU) <span className="text-red-500">*</span>
              </label>
              <select
                value={compute}
                onChange={(e) => setCompute(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#6222cc] outline-hidden"
              >
                <option value="2 vCPU">2 vCPU</option>
                <option value="4 vCPU">4 vCPU</option>
                <option value="8 vCPU">8 vCPU</option>
                <option value="16 vCPU">16 vCPU</option>
              </select>
            </div>

            {/* Memory (RAM) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Memory (RAM) <span className="text-red-500">*</span>
              </label>
              <select
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#6222cc] outline-hidden"
              >
                <option value="8 GB">8 GB</option>
                <option value="16 GB">16 GB</option>
                <option value="32 GB">32 GB</option>
                <option value="64 GB">64 GB</option>
              </select>
            </div>

            {/* Storage */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <label className="text-xs font-semibold text-slate-700">Storage</label>
                <span className="text-red-500 text-xs">*</span>
                <Info className="h-3 w-3 text-slate-400" />
              </div>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#6222cc] outline-hidden"
              >
                <option value="100 GB (SSD)">100 GB (SSD)</option>
                <option value="200 GB (SSD)">200 GB (SSD)</option>
                <option value="500 GB (SSD)">500 GB (SSD)</option>
                <option value="1 TB (SSD)">1 TB (SSD)</option>
              </select>
            </div>

            {/* Database */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <label className="text-xs font-semibold text-slate-700">Database</label>
                <span className="text-red-500 text-xs">*</span>
                <Info className="h-3 w-3 text-slate-400" />
              </div>
              <select
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#6222cc] outline-hidden"
              >
                <option value="PostgreSQL (Managed)">PostgreSQL (Managed)</option>
                <option value="MySQL (Managed)">MySQL (Managed)</option>
                <option value="MongoDB Atlas">MongoDB Atlas</option>
              </select>
            </div>
          </div>

          {/* Card 2: Tenant Setup Options */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Sliders className="h-4 w-4 text-[#6222cc]" />
              <h3 className="text-sm font-bold text-slate-900">Tenant Setup Options</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={createAdminUser}
                  onChange={(e) => setCreateAdminUser(e.target.checked)}
                  className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 accent-indigo-600"
                />
                <span className="flex items-center gap-1">
                  Create Default Admin User
                  <Info className="h-3 w-3 text-slate-400" />
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={provisionRoles}
                  onChange={(e) => setProvisionRoles(e.target.checked)}
                  className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 accent-indigo-600"
                />
                <span>Provision Standard Roles & Permissions</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={enableWorkflows}
                  onChange={(e) => setEnableWorkflows(e.target.checked)}
                  className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 accent-indigo-600"
                />
                <span>Enable Default Workflows</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={importInitialData}
                  onChange={(e) => setImportInitialData(e.target.checked)}
                  className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 accent-indigo-600"
                />
                <span>Import Initial Data (Optional)</span>
              </label>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2 (Middle: 4 cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Configuration */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Server className="h-4 w-4 text-[#6222cc]" />
              <h3 className="text-sm font-bold text-slate-900">Configuration</h3>
            </div>

            {/* Enable SSO */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800">
                  Enable SSO (SAML/OAuth)
                </span>
                <Info className="h-3 w-3 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => setEnableSSO(!enableSSO)}
                className={cn(
                  'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                  enableSSO ? 'bg-[#6222cc] justify-end' : 'bg-slate-300 justify-start'
                )}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Custom Domain */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-800">Custom Domain</span>
                  <Info className="h-3 w-3 text-slate-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setCustomDomainEnabled(!customDomainEnabled)}
                  className={cn(
                    'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                    customDomainEnabled ? 'bg-[#6222cc] justify-end' : 'bg-slate-300 justify-start'
                  )}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>
              {customDomainEnabled && (
                <div className="relative">
                  <Input
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="h-8 text-xs font-medium text-slate-800 bg-slate-50/50 pr-7"
                  />
                  <Check className="h-3.5 w-3.5 text-emerald-600 absolute right-2.5 top-2.5 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Email SMTP */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800">Email (SMTP)</span>
                <Info className="h-3 w-3 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => setEnableSMTP(!enableSMTP)}
                className={cn(
                  'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                  enableSMTP ? 'bg-[#6222cc] justify-end' : 'bg-slate-300 justify-start'
                )}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* WhatsApp Integration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800">WhatsApp Integration</span>
                <Info className="h-3 w-3 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => setEnableWhatsApp(!enableWhatsApp)}
                className={cn(
                  'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                  enableWhatsApp ? 'bg-[#6222cc] justify-end' : 'bg-slate-300 justify-start'
                )}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Other Integrations */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800">Other Integrations</span>
                <Info className="h-3 w-3 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => setEnableOtherIntegrations(!enableOtherIntegrations)}
                className={cn(
                  'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                  enableOtherIntegrations ? 'bg-[#6222cc] justify-end' : 'bg-slate-300 justify-start'
                )}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>
          </div>

          {/* Card 2: Security & Compliance */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Shield className="h-4 w-4 text-[#6222cc]" />
              <h3 className="text-sm font-bold text-slate-900">Security & Compliance</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={enableEncryption}
                  onChange={(e) => setEnableEncryption(e.target.checked)}
                  className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 accent-indigo-600"
                />
                <span>Enable Data Encryption (at rest & in transit)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={enableAuditLogs}
                  onChange={(e) => setEnableAuditLogs(e.target.checked)}
                  className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 accent-indigo-600"
                />
                <span>Enable Audit Logs</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={enableGDPR}
                  onChange={(e) => setEnableGDPR(e.target.checked)}
                  className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 accent-indigo-600"
                />
                <span>GDPR/DPDP Compliance Settings</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={enableBackup}
                  onChange={(e) => setEnableBackup(e.target.checked)}
                  className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 accent-indigo-600"
                />
                <span>Backup & Disaster Recovery (Daily)</span>
              </label>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3 (Right Summary: 4 cols) ================= */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="h-4 w-4 text-[#6222cc]" />
              <h3 className="text-sm font-bold text-slate-900">Provisioning Summary</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Organization</span>
                <span className="font-bold text-slate-900">Bright Future School</span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Product</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <GraduationCap className="h-4 w-4 text-[#6222cc]" />
                  <span>Pegatto Education</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Plan</span>
                <span className="px-2 py-0.5 bg-blue-50 text-[#6222cc] font-bold rounded-md border border-blue-200/60 text-[11px]">
                  Professional
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Environment</span>
                <span className="font-semibold text-slate-900">{environmentType}</span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Resources</span>
                <span className="font-semibold text-slate-900">
                  {compute} | {memory} | {storage.replace(' (SSD)', '')} SSD
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Database</span>
                <span className="font-semibold text-slate-900">{database}</span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Custom Domain</span>
                <span className="font-medium text-slate-700">
                  {customDomainEnabled ? customDomain : 'None'}
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Integrations</span>
                <span className="font-medium text-slate-700">
                  {enableSMTP ? 'SMTP (Enabled)' : 'Default'}
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">Security</span>
                <span className="font-medium text-slate-700">Encryption, Audit Logs, GDPR</span>
              </div>
            </div>

            {/* Estimated Time Alert */}
            <div className="flex items-center gap-2 p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs font-semibold text-[#521cb0]">
              <Clock className="h-4 w-4 text-[#6222cc] shrink-0" />
              <span>Estimated Provisioning Time:</span>
              <span className="font-bold text-[#6222cc]">~ 10 – 15 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Action Bar matching Image 2 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/tenant-management/onboarding')}
          className="text-xs sm:text-sm font-semibold text-slate-700 border-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            className="text-xs sm:text-sm font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
          >
            Save as Draft
          </Button>

          <Button
            type="button"
            onClick={handleProvisionTenant}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Rocket className="h-4 w-4" />
            <span>Provision Tenant</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
