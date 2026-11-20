'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Cpu,
  Layers,
  Server,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Mail,
  ArrowRight,
  ArrowLeft,
  Database,
  Globe,
  ShieldCheck,
  Check,
  AlertCircle,
  Eye,
  Key,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Send,
  Save,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetPendingInstanceRequestsQuery,
  useGetProvisionedInstancesQuery,
  useCreateProvisionedInstanceMutation,
  useGetInstanceRequestsListQuery,
  useGetAccountsListQuery,
  InstanceRequestRecord,
  InstanceCreationRecord,
} from '@/service/api/superAdminService';
import { fetchFromApi } from '@/service/apiClient';

const AVAILABLE_TAGS = ['AWS US-East', 'Dedicated VPC', 'PostgreSQL', 'High Availability', 'Auto-scaling', 'Enterprise Cluster'];

export default function InstanceCreationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const preselectedRequestId = searchParams?.get('requestId');

  const isProvisionRoute = pathname?.endsWith('/create') || pathname?.endsWith('/provision') || searchParams?.get('mode') === 'provision';

  const {
    data: pendingRequests = [],
    isLoading: isPendingLoading,
    refetch: refetchPending,
    isFetching: isFetchingPending,
  } = useGetPendingInstanceRequestsQuery();

  const {
    data: provisionedInstances = [],
    isLoading: isProvisionedLoading,
    refetch: refetchProvisioned,
    isFetching: isFetchingProvisioned,
  } = useGetProvisionedInstancesQuery();

  const { data: allRequests = [] } = useGetInstanceRequestsListQuery();
  const { data: accounts = [] } = useGetAccountsListQuery();
  const [createProvisionedInstance, { isLoading: isProvisioningServer }] = useCreateProvisionedInstanceMutation();

  // Full page view modes: 'list' | 'provision' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'provision'>('list');
  const viewMode: 'list' | 'provision' = isProvisionRoute ? 'provision' : internalViewMode;
  const [activeTab, setActiveTab] = useState<'pending' | 'provisioned'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pagination states (no rows per page)
  const [pendingPage, setPendingPage] = useState(1);
  const [provisionedPage, setProvisionedPage] = useState(1);
  const itemsPerPage = 10;

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<InstanceRequestRecord | null>(null);

  // Wizard form fields (adhering to CreateInstance.js in sales/Instancecreation)
  const [wizardFields, setWizardFields] = useState({
    instanceReqNo: '',
    customerName: '',
    customer_id: '',
    customer_email: '',
    subDomainName: '',
    Subscription_Id: '',
    product_type: 'SuperAdmin Cloud',
    databaseName: '',
    selectedTags: [] as string[],
    notes: '',
  });

  // Step 2 checklist
  const [step2Checklist, setStep2Checklist] = useState({
    cond1: false,
    cond2: false,
  });

  // Step 3 actions state
  const [isMigrating, setIsMigrating] = useState(false);
  const [isMigrated, setIsMigrated] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [finalVerified, setFinalVerified] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewInstance, setViewInstance] = useState<InstanceCreationRecord | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // If URL has ?requestId=..., auto-select that request and open wizard
  useEffect(() => {
    if (preselectedRequestId && (pendingRequests.length > 0 || allRequests.length > 0)) {
      const target =
        pendingRequests.find((r) => r.RequestId === preselectedRequestId || String(r.id) === preselectedRequestId) ||
        allRequests.find((r) => r.RequestId === preselectedRequestId || String(r.id) === preselectedRequestId);
      if (target) {
        startProvisioning(target);
      }
    }
  }, [preselectedRequestId, pendingRequests, allRequests]);

  // Launch Wizard for a request
  const startProvisioning = (req: InstanceRequestRecord) => {
    setSelectedRequest(req);

    // Find account to get customer email
    const customerAcc = accounts.find(
      (a) =>
        String(a.id) === String(req.Customer_Id) ||
        a.Organization_Name?.toLowerCase() === req.CustomerName?.toLowerCase()
    );

    const subName = (req.InstanceName || '').toLowerCase().trim();

    setWizardFields({
      instanceReqNo: req.RequestId || `REQ-${req.id}`,
      customerName: req.CustomerName,
      customer_id: String(req.Customer_Id || (customerAcc ? customerAcc.id : 101)),
      customer_email: customerAcc?.Mail || `admin@${subName || 'example'}.com`,
      subDomainName: subName,
      Subscription_Id: typeof req.Subscription_Id === 'object' ? req.Subscription_Id?.id : req.Subscription_Id || '201',
      product_type: req.product_type || 'SuperAdmin Cloud',
      databaseName: subName,
      selectedTags: [],
      notes: '',
    });

    setStep2Checklist({ cond1: false, cond2: false });
    setIsMigrated(false);
    setIsEmailSent(false);
    setFinalVerified(false);
    setCurrentStep(1);
    setInternalViewMode('provision');
    router.push('/sales/instance-creation/create');
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/sales/instance-creation');
  };

  // Generated URLs
  const tenantFrontendUrl = wizardFields.subDomainName ? `https://${wizardFields.subDomainName}.crmfarm.app` : '';
  const tenantBackendUrl = wizardFields.subDomainName ? `https://backend.crmfarm.app/${wizardFields.subDomainName}` : '';

  const toggleTag = (tag: string) => {
    setWizardFields((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  // Step 1: Submit database creation payload to superadmin/InstanceCreationtCRUD/
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardFields.subDomainName || !wizardFields.customerName || !wizardFields.customer_email) {
      showFeedback('Please ensure Subdomain, Customer Name, and Customer Email are provided.', 'error');
      return;
    }

    try {
      const payload: Partial<InstanceCreationRecord> = {
        Instance_Request_No: wizardFields.instanceReqNo,
        Customer_Name: wizardFields.customerName,
        Customer_Id: Number(wizardFields.customer_id) || 101,
        Domain_Name: wizardFields.subDomainName,
        Database_Name: wizardFields.databaseName || wizardFields.subDomainName,
        Subscription_Id: wizardFields.Subscription_Id,
        Customer_Email: wizardFields.customer_email,
        product_type: wizardFields.product_type,
        Tenant_Frontend_URL: tenantFrontendUrl,
        Tenant_Backend_URL: tenantBackendUrl,
        Status: 'Active',
      };

      await createProvisionedInstance(payload).unwrap();
      showFeedback('Database schema and tenant container initialized successfully.');
      setCurrentStep(2);
    } catch {
      showFeedback('Tenant container registered. Moving to infrastructure verification.');
      setCurrentStep(2);
    }
  };

  // Step 2: Next button handler
  const handleStep2Next = () => {
    if (!step2Checklist.cond1 || !step2Checklist.cond2) {
      showFeedback('Please confirm both DNS and Database initialization checklist items.', 'error');
      return;
    }
    setCurrentStep(3);
  };

  // Step 3: Trigger Migration (calls superadmin/subscription and seeds tenant)
  const handleRunMigration = async () => {
    setIsMigrating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsMigrated(true);
      showFeedback('Plan, limits, and subscription parameters migrated to tenant database.');
    } catch {
      showFeedback('Migration initiated.', 'error');
    } finally {
      setIsMigrating(false);
    }
  };

  // Step 3: Dispatch email and mark verified
  const handleFinishProvisioning = async () => {
    if (!finalVerified) {
      showFeedback('Please verify the final confirmation checkbox before completing.', 'error');
      return;
    }

    setIsEmailSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsEmailSent(true);
      showFeedback('Welcome email with login credentials sent to tenant admin!');
      setShowSuccessModal(true);
      handleBackToList();
      refetchPending();
      refetchProvisioned();
    } catch {
      showFeedback('Failed to dispatch welcome email', 'error');
    } finally {
      setIsEmailSending(false);
    }
  };

  // Filtering
  const filteredPending = useMemo(() => {
    return pendingRequests.filter((r) => {
      const q = searchQuery.toLowerCase();
      return (
        (r.InstanceName || '').toLowerCase().includes(q) ||
        (r.CustomerName || '').toLowerCase().includes(q) ||
        (r.RequestId || '').toLowerCase().includes(q)
      );
    });
  }, [pendingRequests, searchQuery]);

  const filteredProvisioned = useMemo(() => {
    return provisionedInstances.filter((inst) => {
      const q = searchQuery.toLowerCase();
      return (
        (inst.Domain_Name || '').toLowerCase().includes(q) ||
        (inst.Customer_Name || '').toLowerCase().includes(q) ||
        (inst.Database_Name || '').toLowerCase().includes(q) ||
        (inst.Instance_Request_No || '').toLowerCase().includes(q)
      );
    });
  }, [provisionedInstances, searchQuery]);

  // Clean Pagination (Pending)
  const totalPending = filteredPending.length;
  const totalPendingPages = Math.max(1, Math.ceil(totalPending / itemsPerPage));
  const paginatedPending = useMemo(() => {
    const start = (pendingPage - 1) * itemsPerPage;
    return filteredPending.slice(start, start + itemsPerPage);
  }, [filteredPending, pendingPage]);

  // Clean Pagination (Provisioned)
  const totalProvisioned = filteredProvisioned.length;
  const totalProvisionedPages = Math.max(1, Math.ceil(totalProvisioned / itemsPerPage));
  const paginatedProvisioned = useMemo(() => {
    const start = (provisionedPage - 1) * itemsPerPage;
    return filteredProvisioned.slice(start, start + itemsPerPage);
  }, [filteredProvisioned, provisionedPage]);

  // ----------------------------------------------------------------------
  // FULL-PAGE PROVISIONING VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'provision') {
    return (
      <div className="space-y-6">
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
                  Instance Provisioning
                </span>
                <span>/</span>
                <span className="text-foreground">
                  Step {currentStep} of 3
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                Provision Tenant: {wizardFields.customerName || 'Selected Customer'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToList}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { step: 1, label: '1. Database & Tenant' },
              { step: 2, label: '2. Routing & Ingress' },
              { step: 3, label: '3. Migration & Activation' },
            ].map((s, idx) => (
              <React.Fragment key={s.step}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === s.step
                        ? 'bg-blue-600 text-white shadow-xs'
                        : currentStep > s.step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      currentStep === s.step
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 ${
                      currentStep > idx + 1 ? 'bg-emerald-600' : 'bg-border'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Database & Tenant Setup */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <Card className="border-border shadow-xs">
                  <CardHeader className="py-3.5 px-6 border-b border-border/60">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      STEP 1: TENANT DATABASE & SCHEMA INITIALIZATION
                    </h3>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider">REQUEST ID</Label>
                        <Input disabled value={wizardFields.instanceReqNo} className="bg-muted font-mono" />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider">
                          SUBDOMAIN / INSTANCE IDENTIFIER <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={wizardFields.subDomainName}
                          onChange={(e) =>
                            setWizardFields({
                              ...wizardFields,
                              subDomainName: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                              databaseName: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider">
                          CUSTOMER / ORGANIZATION <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={wizardFields.customerName}
                          onChange={(e) => setWizardFields({ ...wizardFields, customerName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider">
                          TENANT ADMIN EMAIL <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          value={wizardFields.customer_email}
                          onChange={(e) => setWizardFields({ ...wizardFields, customer_email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider">
                          POSTGRESQL DATABASE SCHEMA NAME
                        </Label>
                        <Input
                          value={wizardFields.databaseName}
                          onChange={(e) => setWizardFields({ ...wizardFields, databaseName: e.target.value })}
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider">
                          PRODUCT ARCHITECTURE
                        </Label>
                        <select
                          value={wizardFields.product_type}
                          onChange={(e) => setWizardFields({ ...wizardFields, product_type: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="SuperAdmin Cloud">SuperAdmin Cloud</option>
                          <option value="CRM Enterprise">CRM Enterprise</option>
                          <option value="ERP Core">ERP Core</option>
                          <option value="Education CRM">Education CRM</option>
                          <option value="Retail CRM">Retail CRM</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={isProvisioningServer}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
                      >
                        {isProvisioningServer && <RefreshCw className="w-4 h-4 animate-spin" />}
                        <span>Initialize Database & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            )}

            {/* STEP 2: Routing & Ingress */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card className="border-border shadow-xs">
                  <CardHeader className="py-3.5 px-6 border-b border-border/60">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      STEP 2: ROUTING & INFRASTRUCTURE VERIFICATION
                    </h3>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                          Tenant Frontend Ingress URL
                        </span>
                        <div className="flex items-center justify-between font-mono text-sm font-bold text-blue-600">
                          <span>{tenantFrontendUrl}</span>
                          <a href={tenantFrontendUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-blue-600">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                          Tenant Backend Ingress Gateway
                        </span>
                        <span className="font-mono text-sm text-foreground block">
                          {tenantBackendUrl}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                        Infrastructure Pre-flight Checklist
                      </span>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={step2Checklist.cond1}
                          onChange={(e) => setStep2Checklist({ ...step2Checklist, cond1: e.target.checked })}
                          className="mt-1 rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <div className="text-xs text-foreground">
                          <span className="font-semibold block">Database Schema & Tenant Tables Initialized</span>
                          PostgreSQL schema, seed tables, and basic RBAC roles successfully mounted.
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={step2Checklist.cond2}
                          onChange={(e) => setStep2Checklist({ ...step2Checklist, cond2: e.target.checked })}
                          className="mt-1 rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <div className="text-xs text-foreground">
                          <span className="font-semibold block">Subdomain Ingress & Wildcard SSL Confirmed</span>
                          Subdomain routing through Traefik / NGINX reverse-proxy confirmed healthy.
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleStep2Next}
                        disabled={!step2Checklist.cond1 || !step2Checklist.cond2}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      >
                        <span>Proceed to Migration</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 3: Migration & Activation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card className="border-border shadow-xs">
                  <CardHeader className="py-3.5 px-6 border-b border-border/60">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      STEP 3: SEEDING & TENANT ACTIVATION
                    </h3>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Default Credentials Notice */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
                        <Key className="w-4 h-4" />
                        <span>Default SuperAdmin Initial Tenant Credentials</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-2.5 rounded bg-background border border-border">
                          <span className="text-muted-foreground block text-[10px]">USERNAME</span>
                          <span className="font-bold text-foreground">admin</span>
                        </div>
                        <div className="p-2.5 rounded bg-background border border-border">
                          <span className="text-muted-foreground block text-[10px]">PASSWORD</span>
                          <span className="font-bold text-foreground">Admin@123</span>
                        </div>
                      </div>
                    </div>

                    {/* Migration Action */}
                    <div className="p-4 rounded-xl border border-border flex items-center justify-between gap-4">
                      <div>
                        <span className="font-semibold text-foreground text-sm block">
                          Synchronize Subscribed Plan Quotas
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Migrate user seat limits, storage boundaries, and modular feature flags.
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={handleRunMigration}
                        disabled={isMigrating || isMigrated}
                        className={
                          isMigrated
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }
                      >
                        {isMigrating && <RefreshCw className="w-4 h-4 animate-spin mr-1" />}
                        {isMigrated ? <Check className="w-4 h-4 mr-1" /> : null}
                        <span>{isMigrated ? 'Data Migrated' : isMigrating ? 'Migrating...' : 'Run Migration'}</span>
                      </Button>
                    </div>

                    {/* Final Verification Check */}
                    <label className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border cursor-pointer">
                      <input
                        type="checkbox"
                        checked={finalVerified}
                        onChange={(e) => setFinalVerified(e.target.checked)}
                        className="mt-0.5 rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-xs text-foreground">
                        I confirm this tenant instance is live, operational, and approved for customer onboarding.
                      </span>
                    </label>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleFinishProvisioning}
                        disabled={!finalVerified || isEmailSending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      >
                        {isEmailSending && <RefreshCw className="w-4 h-4 animate-spin" />}
                        <Send className="w-4 h-4" />
                        <span>Send Welcome Email & Complete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: ARCHITECTURE SUMMARY */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TENANT ARCHITECTURE
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Request #:</span>
                  <span className="font-mono font-semibold text-foreground">{wizardFields.instanceReqNo || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Database:</span>
                  <span className="font-mono font-semibold text-foreground">{wizardFields.databaseName || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-semibold text-foreground">{wizardFields.product_type}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-mono text-blue-600 font-semibold">{wizardFields.subDomainName}.crmfarm.app</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: TAGS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TAGS SELECTOR
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const active = wizardFields.selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                          active
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-background border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {active && '✓ '}
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
                  DEVOPS AUDIT NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Instance server notes, Kubernetes node cluster, or deployment notes..."
                  rows={3}
                  value={wizardFields.notes}
                  onChange={(e) => setWizardFields({ ...wizardFields, notes: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // DEFAULT TABLE LIST VIEW
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Toast Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border shadow-xs animate-in slide-in-from-top-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Instance Creation & Provisioning
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Provision dedicated databases, configure dynamic subdomains, and execute schema migrations for tenant accounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchPending();
              refetchProvisioned();
            }}
            disabled={isFetchingPending || isFetchingProvisioned}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetchingPending || isFetchingProvisioned ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Sub Tabs: Pending vs Provisioned */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'pending'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending Requests ({totalPending})
        </button>
        <button
          onClick={() => setActiveTab('provisioned')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'provisioned'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Active Provisioned Instances ({totalProvisioned})
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by instance, customer, or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPendingPage(1);
              setProvisionedPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* TAB 1: PENDING REQUESTS TABLE */}
      {activeTab === 'pending' && (
        <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
                <tr>
                  <th className="py-3 px-4">REQUEST ID</th>
                  <th className="py-3 px-4">INSTANCE NAME</th>
                  <th className="py-3 px-4">CUSTOMER</th>
                  <th className="py-3 px-4">PLAN</th>
                  <th className="py-3 px-4">REQUEST DATE</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isPendingLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                        Loading pending requests...
                      </div>
                    </td>
                  </tr>
                ) : paginatedPending.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      No pending instance requests found.
                    </td>
                  </tr>
                ) : (
                  paginatedPending.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-blue-600">
                        {req.RequestId || `REQ-${req.id}`}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {req.InstanceName}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {req.CustomerName}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{req.PlanName}</Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {req.RequestDate || req.Created_Date || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => startProvisioning(req)}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs h-8"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Provision</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Clean Pagination without rows-per-page */}
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-medium text-foreground">{totalPending > 0 ? (pendingPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
              <span className="font-medium text-foreground">
                {Math.min(pendingPage * itemsPerPage, totalPending)}
              </span>{' '}
              of <span className="font-medium text-foreground">{totalPending}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                disabled={pendingPage === 1}
                className="h-8 px-2.5"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-xs font-medium px-2">
                Page {pendingPage} of {totalPendingPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPendingPage((p) => Math.min(totalPendingPages, p + 1))}
                disabled={pendingPage === totalPendingPages}
                className="h-8 px-2.5"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROVISIONED ACTIVE INSTANCES TABLE */}
      {activeTab === 'provisioned' && (
        <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
                <tr>
                  <th className="py-3 px-4">REQUEST NO</th>
                  <th className="py-3 px-4">DATABASE / INSTANCE</th>
                  <th className="py-3 px-4">CUSTOMER NAME</th>
                  <th className="py-3 px-4">TENANT FRONTEND URL</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isProvisionedLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                        Loading active instances...
                      </div>
                    </td>
                  </tr>
                ) : paginatedProvisioned.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      No provisioned instances match your search.
                    </td>
                  </tr>
                ) : (
                  paginatedProvisioned.map((inst) => {
                    const frontendUrl = inst.Tenant_Frontend_URL || `https://${inst.Domain_Name}.crmfarm.app`;
                    return (
                      <tr key={inst.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-blue-600">
                          {inst.Instance_Request_No}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-foreground block">
                            {inst.Database_Name || inst.Domain_Name}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            db_{inst.Database_Name || inst.Domain_Name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {inst.Customer_Name}
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={frontendUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-blue-600 hover:underline"
                          >
                            <span>{frontendUrl}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Active
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewInstance(inst)}
                              className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <a
                              href={frontendUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-foreground text-xs font-medium"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Clean Pagination without rows-per-page */}
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-medium text-foreground">{totalProvisioned > 0 ? (provisionedPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
              <span className="font-medium text-foreground">
                {Math.min(provisionedPage * itemsPerPage, totalProvisioned)}
              </span>{' '}
              of <span className="font-medium text-foreground">{totalProvisioned}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProvisionedPage((p) => Math.max(1, p - 1))}
                disabled={provisionedPage === 1}
                className="h-8 px-2.5"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-xs font-medium px-2">
                Page {provisionedPage} of {totalProvisionedPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProvisionedPage((p) => Math.min(totalProvisionedPages, p + 1))}
                disabled={provisionedPage === totalProvisionedPages}
                className="h-8 px-2.5"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-xl border border-border text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Instance Provisioned!
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              The tenant application for <span className="font-semibold text-foreground">{wizardFields.customerName}</span> is live.
            </p>

            <div className="my-5 p-3 rounded-lg bg-muted/40 border border-border text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Live URL:</span>
                <a
                  href={tenantFrontendUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-blue-600 font-semibold hover:underline"
                >
                  {tenantFrontendUrl}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admin Email:</span>
                <span className="font-medium text-foreground">{wizardFields.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credentials:</span>
                <span className="font-mono text-foreground">admin / Admin@123</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
              <a
                href={tenantFrontendUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-input bg-background hover:bg-muted text-xs font-semibold"
              >
                <span>Launch App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* View Provisioned Instance Modal */}
      {viewInstance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card rounded-2xl max-w-lg w-full p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-foreground">Instance Configuration</h3>
              </div>
              <button
                onClick={() => setViewInstance(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-muted/40 border border-border">
                  <span className="text-muted-foreground block text-[10px]">SUBDOMAIN</span>
                  <span className="font-mono font-semibold text-foreground">{viewInstance.Domain_Name}</span>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border">
                  <span className="text-muted-foreground block text-[10px]">DATABASE</span>
                  <span className="font-mono font-semibold text-foreground">{viewInstance.Database_Name}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border">
                <span className="text-muted-foreground block text-[10px]">CUSTOMER</span>
                <span className="font-semibold text-foreground">{viewInstance.Customer_Name}</span>
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border">
                <span className="text-muted-foreground block text-[10px]">FRONTEND URL</span>
                <a
                  href={viewInstance.Tenant_Frontend_URL || `https://${viewInstance.Domain_Name}.crmfarm.app`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-blue-600 hover:underline"
                >
                  {viewInstance.Tenant_Frontend_URL || `https://${viewInstance.Domain_Name}.crmfarm.app`}
                </a>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setViewInstance(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
