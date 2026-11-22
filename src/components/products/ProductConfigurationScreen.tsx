'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Layers,
  ToggleLeft,
  ToggleRight,
  GitFork,
  Link2,
  Palette,
  Sliders,
  Check,
  Plus,
  Play,
  Upload,
  MoreVertical,
  Edit2,
  Trash2,
  GraduationCap,
  Users,
  CreditCard,
  Calendar,
  ClipboardList,
  BookOpen,
  Megaphone,
  BarChart2,
  Globe,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Folder,
  FileText,
  Headphones,
  CheckSquare,
  Square,
  RotateCcw,
  Sparkles,
  Zap,
  Key,
  Webhook,
  ArrowRight,
  ArrowDown,
  Fingerprint,
  Mail,
  MessageSquare,
  Smartphone,
  Shield,
  Workflow,
  Image as ImageIcon,
  Database,
  Lock,
  Layout,
  LayoutGrid,
  Sun,
  Moon,
  Monitor,
  Rocket,
  Code,
  Puzzle,
  FileCheck,
  Flag,
  GripVertical,
  Bot,
  ExternalLink,
  RefreshCw,
  Copy,
  Clock,
  HardDrive,
  Cpu,
  Server,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ProductConfigScreenProps {
  initialTab?: 'general' | 'module' | 'features' | 'workflow' | 'integrations' | 'branding' | 'advanced';
}

export function ProductConfigurationScreen({ initialTab = 'general' }: ProductConfigScreenProps) {
  const router = useRouter();

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState<
    'general' | 'module' | 'features' | 'workflow' | 'integrations' | 'branding' | 'advanced'
  >(initialTab);

  // Selected product & edition dropdowns
  const [selectedProduct, setSelectedProduct] = useState('Pegatto Education');
  const [selectedEdition, setSelectedEdition] = useState('Standard');

  // ==========================================
  // STATE: GENERAL SETTINGS (Image 1 from turn 3)
  // ==========================================
  const [generalForm, setGeneralForm] = useState({
    productName: 'Pegatto Education',
    productCode: 'PEG-EDU',
    defaultEdition: 'Standard',
    defaultPlan: 'Basic',
    trialPeriod: 14,
    defaultTimeZone: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    defaultLanguage: 'English',
    productStatus: true,
  });

  const [businessRules, setBusinessRules] = useState({
    selfRegistration: true,
    requireApproval: true,
    trialAutoConversion: true,
    editionUpgradeDowngrade: true,
    multiCampus: true,
  });

  const [quotas, setQuotas] = useState({
    users: '50',
    students: '500',
    storage: '100 GB',
    emails: '10,000',
    whatsapp: '5,000',
  });

  const [generalModulesList, setGeneralModulesList] = useState([
    { id: 'gm-1', name: 'Admission & Enquiry', icon: Users, status: 'Enabled', settings: 'Lead capture, counselling, admission flow' },
    { id: 'gm-2', name: 'Student Management', icon: BookOpen, status: 'Enabled', settings: 'Student profile, class, section, roll no.' },
    { id: 'gm-3', name: 'Fees & Payments', icon: CreditCard, status: 'Enabled', settings: 'Fee structure, online payment, reminders' },
    { id: 'gm-4', name: 'Attendance', icon: Calendar, status: 'Enabled', settings: 'Biometric / Manual, threshold 75%' },
    { id: 'gm-5', name: 'Timetable', icon: Calendar, status: 'Enabled', settings: 'Auto generation, period & teacher mapping' },
    { id: 'gm-6', name: 'Assessment & Exams', icon: ClipboardList, status: 'Enabled', settings: 'Exam types, grading, result processing' },
  ]);

  // ==========================================
  // STATE: MODULE CONFIGURATION (Image 2 from new upload)
  // ==========================================
  const [modulesCatalog, setModulesCatalog] = useState([
    { id: 'mod-1', name: 'Admission & Enquiry', code: 'ADM', icon: Users, enabled: true },
    { id: 'mod-2', name: 'Student Management', code: 'STU', icon: BookOpen, enabled: true },
    { id: 'mod-3', name: 'Fees & Payments', code: 'FEE', icon: CreditCard, enabled: true },
    { id: 'mod-4', name: 'Attendance', code: 'ATT', icon: Calendar, enabled: true },
    { id: 'mod-5', name: 'Timetable', code: 'TTB', icon: Calendar, enabled: true },
    { id: 'mod-6', name: 'Assessment & Exams', code: 'EXM', icon: ClipboardList, enabled: true },
    { id: 'mod-7', name: 'Homework & Assignments', code: 'HWK', icon: BookOpen, enabled: true },
    { id: 'mod-8', name: 'Communication', code: 'COM', icon: Megaphone, enabled: true },
    { id: 'mod-9', name: 'Portals (Student/Parent/Teacher)', code: 'POR', icon: Users, enabled: true },
    { id: 'mod-10', name: 'Analytics & Reports', code: 'REP', icon: BarChart2, enabled: true },
    { id: 'mod-11', name: 'Transport', code: 'TRN', icon: Rocket, enabled: false },
    { id: 'mod-12', name: 'Library', code: 'LIB', icon: BookOpen, enabled: false },
  ]);

  const [selectedModuleInConfig, setSelectedModuleInConfig] = useState('Admission & Enquiry');

  const [moduleSettingsForm, setModuleSettingsForm] = useState({
    moduleName: 'Admission & Enquiry',
    displayName: 'Admissions',
    moduleCode: 'ADM',
    status: true,
    description: 'Manage end-to-end lead capture, counselling, shortlisting, admission and enrolment.',
    includeStandard: true,
    includeEnterprise: true,
    allowTrial: true,
    allowFreeCore: false,
    defaultLeadSource: 'Website',
    autoLeadAssignment: true,
    enableLeadScoringAi: true,
    enableCounsellingWorkflow: true,
  });

  const [moduleFeaturesList, setModuleFeaturesList] = useState([
    { id: 'mf-1', name: 'Lead Capture', icon: Filter, config: 'Sources: Website, FB, Insta, WhatsApp, Walk-in', status: true },
    { id: 'mf-2', name: 'Enquiry Management', icon: Users, config: 'Track, qualify and nurture enquiries', status: true },
    { id: 'mf-3', name: 'Counselling', icon: Headphones, config: 'Schedule, notes, follow-ups, outcome', status: true },
    { id: 'mf-4', name: 'Shortlisting', icon: ClipboardList, config: 'Merit, criteria, document verification', status: true },
    { id: 'mf-5', name: 'Admission & Enrolment', icon: GraduationCap, config: 'Application, approval, enrolment, student creation', status: true },
    { id: 'mf-6', name: 'Document Management', icon: Folder, config: 'Upload, verify and manage documents', status: true },
  ]);

  // ==========================================
  // STATE: FEATURE CONTROLS (Image 1 from new upload)
  // ==========================================
  const [selectedFeatureControlModule, setSelectedFeatureControlModule] = useState('Admission & Enquiry');

  const [featureControls, setFeatureControls] = useState([
    { id: 'fc-1', name: 'Lead Capture', icon: Filter, enabled: true, accessControl: 'All Users', limits: 'Unlimited' },
    { id: 'fc-2', name: 'Enquiry Management', icon: Users, enabled: true, accessControl: 'Admissions Team', limits: 'Unlimited' },
    { id: 'fc-3', name: 'Counselling', icon: Headphones, enabled: true, accessControl: 'Counsellor', limits: 'Up to 500 / month' },
    { id: 'fc-4', name: 'Shortlisting', icon: ClipboardList, enabled: true, accessControl: 'Admissions Team', limits: 'Unlimited' },
    { id: 'fc-5', name: 'Admission & Enrolment', icon: GraduationCap, enabled: true, accessControl: 'Admin + Admissions', limits: 'Up to 1,000 / year' },
    { id: 'fc-6', name: 'Online Application', icon: FileText, enabled: true, accessControl: 'All Users', limits: 'Unlimited' },
    { id: 'fc-7', name: 'Document Verification', icon: Folder, enabled: true, accessControl: 'Admissions Team', limits: 'Up to 1 GB / file' },
    { id: 'fc-8', name: 'Enquiry Reports', icon: BarChart2, enabled: false, accessControl: 'Admin Only', limits: '—' },
  ]);

  const [tenantFeatureCustomization, setTenantFeatureCustomization] = useState(true);
  const [showFeatureInTenantSettings, setShowFeatureInTenantSettings] = useState(true);
  const [logFeatureUsageAuditTrail, setLogFeatureUsageAuditTrail] = useState(true);

  // ==========================================
  // STATE: WORKFLOWS & APPROVALS (Image 4 from previous)
  // ==========================================
  const [selectedWorkflow, setSelectedWorkflow] = useState('Student Admission');
  const [workflowSettings, setWorkflowSettings] = useState({
    name: 'Student Admission',
    module: 'Admission & Enquiry',
    appliesTo: 'New Admission',
    isActive: true,
    emailNotifications: true,
    slaMonitoring: true,
  });

  const [approvalMatrix, setApprovalMatrix] = useState([
    { id: 'ap-1', level: 'Level 1 – Document Check', approver: 'Admissions Team', condition: '—' },
    { id: 'ap-2', level: 'Level 2 – Academic Approval', approver: 'Principal', condition: 'If Grade ≥ 8' },
    { id: 'ap-3', level: 'Level 3 – Fee Concession', approver: 'Correspondent / Trustee', condition: 'If Concession ≥ 10%' },
  ]);

  const [automations, setAutomations] = useState([
    { id: 'au-1', label: 'Create student record after final approval', checked: true },
    { id: 'au-2', label: 'Send approval/rejection email to applicant', checked: true },
    { id: 'au-3', label: 'Update admission status automatically', checked: true },
    { id: 'au-4', label: 'Create fee invoice on enrolment', checked: false },
  ]);

  // ==========================================
  // STATE: INTEGRATIONS (Image 3 from previous)
  // ==========================================
  const [integrationCategory, setIntegrationCategory] = useState('All');
  const [integrationsList, setIntegrationsList] = useState([
    { id: 'int-1', name: 'WhatsApp Business (Cloud API)', category: 'Communication', desc: 'Send notifications, alerts and follow-ups', connected: true, icon: 'whatsapp' },
    { id: 'int-2', name: 'Email (SMTP)', category: 'Communication', desc: 'Transactional & bulk emails (e.g., GoDaddy)', connected: true, icon: 'email' },
    { id: 'int-3', name: 'SMS Gateway', category: 'Communication', desc: 'OTP, alerts and notifications', connected: false, icon: 'sms' },
    { id: 'int-4', name: 'Payment Gateway', category: 'Payments', desc: 'Online fee & invoice payments (Razorpay / PayU / Stripe)', connected: true, icon: 'card' },
    { id: 'int-5', name: 'Biometric Attendance (ZKTeco)', category: 'Productivity', desc: 'Integrate attendance devices (ZKTeco)', connected: true, icon: 'fingerprint' },
    { id: 'int-6', name: 'Microsoft Entra ID (Azure AD)', category: 'Identity & Access', desc: 'Single sign-on (SSO) & user sync', connected: true, icon: 'microsoft' },
    { id: 'int-7', name: 'Google Workspace', category: 'Identity & Access', desc: 'SSO, Calendar, Drive and Gmail integration', connected: false, icon: 'google' },
    { id: 'int-8', name: 'Slack', category: 'Productivity', desc: 'Team notifications and alerts', connected: false, icon: 'slack' },
    { id: 'int-9', name: 'LinkedIn Ads & Leads', category: 'Communication', desc: 'Capture and sync leads from LinkedIn', connected: true, icon: 'linkedin' },
    { id: 'int-10', name: 'Meta (Facebook / Instagram)', category: 'Communication', desc: 'Lead capture from FB & Instagram forms', connected: true, icon: 'meta' },
    { id: 'int-11', name: 'REST API', category: 'Others', desc: 'Programmatic access to Pegatto data', connected: true, icon: 'code' },
    { id: 'int-12', name: 'Webhooks', category: 'Others', desc: 'Real-time event notifications to external apps', connected: true, icon: 'webhook' },
  ]);

  // ==========================================
  // STATE: BRANDING & UI (Image 2 from turn 3)
  // ==========================================
  const [brandingForm, setBrandingForm] = useState({
    productName: 'Pegatto Education',
    tagline: 'Never Miss a Lead. Never Miss an Opportunity.',
    primaryColor: '#6A0DAD',
    secondaryColor: '#2563EB',
    accentColor: '#10B981',
    textColor: '#111827',
    compactMenu: false,
    showModuleIcons: true,
    roundedUi: true,
    enableDarkMode: false,
    enableProductLogoInLogin: true,
    layoutStyle: 'modern' as 'modern' | 'classic' | 'minimal',
    useCustomLoginBackground: true,
    showProductTagline: true,
    displayEditionName: true,
    showHelpSupportLink: false,
  });

  // ==========================================
  // STATE: ADVANCED (Image 4 from new upload)
  // ==========================================
  const [advancedSettings, setAdvancedSettings] = useState({
    mfa: true,
    ipAllowlist: false,
    passwordPolicy: true,
    sessionTimeout: '30 Minutes',
    dataRetentionPolicy: '12 Months',
    cachingRedis: true,
    backgroundJobs: true,
    autoScaling: true,
    systemResourceLimit: 'Medium',
    aiLeadScoring: true,
    aiSalesPrediction: true,
    aiCrmAssistant: true,
    aiCallingAgent: false,
    addonMarketplace: true,
    autoUpdateAddons: true,
    defaultLanguage: 'English',
    dateFormat: 'DD-MMM-YYYY',
    timeZone: '(GMT+05:30) India',
    currency: 'INR (₹)',
    gdprCompliance: true,
    auditTrailLogs: true,
    dataEncryption: true,
    consentManagement: true,
    featureFlags: true,
    betaEarlyAccess: false,
    tenantFeatureOverride: true,
  });

  // Header icon & title based on active tab
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'module':
        return {
          icon: <Layers className="h-7 w-7 text-[#1574fe]" />,
          title: 'Module Configuration',
          desc: 'Enable, configure and manage modules for each product edition',
          actionLabel: 'Save Changes',
          showReset: false,
          showEdition: true,
        };
      case 'features':
        return {
          icon: <ToggleRight className="h-7 w-7 text-[#1574fe]" />,
          title: 'Product Configuration',
          desc: 'Configure product settings, business rules, defaults and feature controls',
          actionLabel: 'Save Changes',
          showReset: false,
          showEdition: true,
        };
      case 'workflow':
        return {
          icon: <GitFork className="h-7 w-7 text-[#1574fe]" />,
          title: 'Workflow & Approvals',
          desc: 'Design and manage business workflows, approval rules and automated actions',
          actionLabel: 'Create Workflow',
          showReset: false,
          showEdition: true,
        };
      case 'integrations':
        return {
          icon: <Link2 className="h-6 w-6 text-[#6366f1]" />,
          title: 'Integrations',
          desc: 'Connect Pegatto with external systems, apps and services for a seamless experience',
          actionLabel: 'Add Integration',
          showReset: false,
          showEdition: true,
        };
      case 'branding':
        return {
          icon: <Palette className="h-7 w-7 text-[#1574fe]" />,
          title: 'Branding & UI',
          desc: 'Customize product branding, look & feel and user experience for each edition',
          actionLabel: 'Save Changes',
          showReset: false,
          showEdition: true,
        };
      case 'advanced':
        return {
          icon: <Sliders className="h-7 w-7 text-[#1574fe]" />,
          title: 'Product Configuration',
          desc: 'Configure product settings, business rules, defaults and feature controls',
          actionLabel: 'Save Changes',
          showReset: false,
          showEdition: true,
        };
      case 'general':
      default:
        return {
          icon: <Settings className="h-7 w-7 text-[#1574fe]" />,
          title: 'Product Configuration',
          desc: 'Configure product settings, business rules, defaults and feature controls',
          actionLabel: 'Save Configuration',
          showReset: true,
          showEdition: false,
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8 font-sans">
      {/* 1. Header Bar matching images */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'p-2.5 rounded-xl border shadow-xs',
              activeTab === 'integrations'
                ? 'bg-purple-50 border-purple-100 text-[#6366f1]'
                : 'bg-blue-50 border-blue-100'
            )}
          >
            {headerInfo.icon}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {headerInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {headerInfo.desc}
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-400 font-medium">Product</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <GraduationCap className={cn('h-4 w-4', activeTab === 'integrations' ? 'text-[#6366f1]' : 'text-[#1574fe]')} />
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="bg-transparent border-none outline-hidden cursor-pointer"
              >
                <option value="Pegatto Education">Pegatto Education</option>
                <option value="Pegatto IT">Pegatto IT</option>
                <option value="Pegatto People">Pegatto People</option>
                <option value="Pegatto Retail">Pegatto Retail</option>
              </select>
            </div>
          </div>

          {headerInfo.showEdition && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
              <span className="text-slate-400 font-medium">Edition</span>
              <select
                value={selectedEdition}
                onChange={(e) => setSelectedEdition(e.target.value)}
                className="bg-transparent border-none outline-hidden font-semibold text-slate-800 cursor-pointer"
              >
                <option value="Standard">Standard</option>
                <option value="Core (Free)">Core (Free)</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          )}

          <Button
            onClick={() => {
              if (activeTab === 'integrations') {
                toast.info('Add Integration dialog');
              } else {
                toast.success('Configuration saved successfully!');
              }
            }}
            className={cn(
              'text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer',
              activeTab === 'integrations'
                ? 'bg-[#6366f1] hover:bg-[#5046e5]'
                : 'bg-[#1574fe] hover:bg-[#0d62e0]'
            )}
          >
            {activeTab === 'integrations' ? <Plus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            <span>{activeTab === 'integrations' ? 'Add Integration' : headerInfo.actionLabel}</span>
          </Button>

          {headerInfo.showReset && (
            <Button
              variant="outline"
              onClick={() => toast.info('Configuration reset to defaults')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="h-4 w-4 text-slate-600" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Top Navigation Tabs Bar matching all 7 tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        {[
          { key: 'general', label: 'General Settings', icon: Settings },
          { key: 'module', label: 'Module Configuration', icon: Layers },
          { key: 'features', label: 'Feature Controls', icon: ToggleRight },
          { key: 'workflow', label: 'Workflows & Approvals', icon: GitFork },
          { key: 'integrations', label: 'Integrations', icon: Link2 },
          { key: 'branding', label: 'Branding & UI', icon: Palette },
          { key: 'advanced', label: 'Advanced', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2 text-xs sm:text-sm font-semibold rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs',
                isActive
                  ? 'bg-[#6366f1] text-white hover:bg-[#5046e5] shadow-purple-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-700')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==============================================================
          TAB 1: GENERAL SETTINGS (Image 1 from turn 3)
         ============================================================== */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Top-Left Card: General Settings Form */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">General Settings</h3>
                <p className="text-xs text-slate-500">Basic product-level configuration and defaults</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="text-xs font-semibold text-slate-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={generalForm.productName}
                  onChange={(e) => setGeneralForm({ ...generalForm, productName: e.target.value })}
                  className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="text-xs font-semibold text-slate-700">
                  Product Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={generalForm.productCode}
                  onChange={(e) => setGeneralForm({ ...generalForm, productCode: e.target.value })}
                  className="h-8.5 font-mono text-xs bg-white border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="text-xs font-semibold text-slate-700">
                  Default Edition <span className="text-red-500">*</span>
                </label>
                <select
                  value={generalForm.defaultEdition}
                  onChange={(e) => setGeneralForm({ ...generalForm, defaultEdition: e.target.value })}
                  className="w-full h-8.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden"
                >
                  <option value="Standard">Standard</option>
                  <option value="Core (Free)">Core (Free)</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="text-xs font-semibold text-slate-700">
                  Default Plan <span className="text-red-500">*</span>
                </label>
                <select
                  value={generalForm.defaultPlan}
                  onChange={(e) => setGeneralForm({ ...generalForm, defaultPlan: e.target.value })}
                  className="w-full h-8.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden"
                >
                  <option value="Basic">Basic</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="text-xs font-semibold text-slate-700">Trial Period (Days)</label>
                <Input
                  type="number"
                  value={generalForm.trialPeriod}
                  onChange={(e) => setGeneralForm({ ...generalForm, trialPeriod: Number(e.target.value) })}
                  className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="text-xs font-semibold text-slate-700">Default Time Zone</label>
                <select
                  value={generalForm.defaultTimeZone}
                  onChange={(e) => setGeneralForm({ ...generalForm, defaultTimeZone: e.target.value })}
                  className="w-full h-8.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden"
                >
                  <option value="(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi">
                    (UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi
                  </option>
                  <option value="(UTC+00:00) London, Dublin, Edinburgh">
                    (UTC+00:00) London, Dublin, Edinburgh
                  </option>
                  <option value="(UTC-05:00) Eastern Time (US & Canada)">
                    (UTC-05:00) Eastern Time (US & Canada)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="text-xs font-semibold text-slate-700">Default Language</label>
                <select
                  value={generalForm.defaultLanguage}
                  onChange={(e) => setGeneralForm({ ...generalForm, defaultLanguage: e.target.value })}
                  className="w-full h-8.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
                <label className="text-xs font-semibold text-slate-700">Product Status</label>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGeneralForm({ ...generalForm, productStatus: !generalForm.productStatus })}
                    className={cn(
                      'w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      generalForm.productStatus ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                  <span className="text-xs font-semibold text-slate-800">
                    {generalForm.productStatus ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Right Card: Module Configuration Summary Table */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Module Configuration</h3>
                <p className="text-xs text-slate-500">Enable, configure and set defaults for modules</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3 w-8 text-center">#</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Default Settings</th>
                    <th className="py-2.5 px-3 text-center w-14">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {generalModulesList.map((mod, idx) => {
                    const Icon = mod.icon;
                    return (
                      <tr key={mod.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-blue-600" />
                            <span className="font-semibold text-slate-900">{mod.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                            {mod.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          {mod.settings}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedModuleInConfig(mod.name);
                              setActiveTab('module');
                            }}
                            className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom-Left Card: Business Rules */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Business Rules</h3>
                <p className="text-xs text-slate-500">Configure key business rules for this product</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { key: 'selfRegistration', label: 'Allow self-registration (students/parents)' },
                { key: 'requireApproval', label: 'Require approval for new tenant' },
                { key: 'trialAutoConversion', label: 'Enable trial to paid auto-conversion' },
                { key: 'editionUpgradeDowngrade', label: 'Allow edition upgrade/downgrade' },
                { key: 'multiCampus', label: 'Enable multi-campus' },
              ].map((rule) => {
                const val = (businessRules as any)[rule.key];
                return (
                  <div key={rule.key} className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-slate-800">{rule.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setBusinessRules({ ...businessRules, [rule.key]: !val })
                      }
                      className={cn(
                        'w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        val ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom-Right Card: Default Limits & Quotas (Standard Edition) */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Default Limits & Quotas (Standard Edition)
                  </h3>
                  <p className="text-xs text-slate-500">Set default limits for core resources</p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info('Edit limits modal')}
                className="h-8 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                <span>Edit Limits</span>
              </Button>
            </div>

            {/* 5 Metric boxes matching image 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-1.5">
                <Users className="h-4 w-4 text-blue-600 mx-auto" />
                <p className="text-[11px] font-semibold text-slate-600">Users</p>
                <p className="text-lg font-bold text-slate-900">{quotas.users}</p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-1.5">
                <GraduationCap className="h-4 w-4 text-blue-600 mx-auto" />
                <p className="text-[11px] font-semibold text-slate-600">Students</p>
                <p className="text-lg font-bold text-slate-900">{quotas.students}</p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-1.5">
                <Database className="h-4 w-4 text-blue-600 mx-auto" />
                <p className="text-[11px] font-semibold text-slate-600">Storage</p>
                <p className="text-lg font-bold text-slate-900">{quotas.storage}</p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-1.5">
                <Mail className="h-4 w-4 text-amber-600 mx-auto" />
                <p className="text-[11px] font-semibold text-slate-600">Emails / Month</p>
                <p className="text-lg font-bold text-slate-900">{quotas.emails}</p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-600 mx-auto" />
                <p className="text-[11px] font-semibold text-slate-600">WhatsApp / Month</p>
                <p className="text-lg font-bold text-slate-900">{quotas.whatsapp}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 2: MODULE CONFIGURATION (Image 2 from new upload)
         ============================================================== */}
      {activeTab === 'module' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1 (3 cols): Modules List (12) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Modules (12)</h3>
                <p className="text-[11px] text-slate-500">Select and configure modules for the edition</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {modulesCatalog.map((mod) => {
                const Icon = mod.icon;
                const isSelected = selectedModuleInConfig === mod.name;
                return (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedModuleInConfig(mod.name)}
                    className={cn(
                      'flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all cursor-pointer',
                      isSelected
                        ? 'bg-blue-50/80 border-blue-200 text-[#0d62e0] font-semibold shadow-xs'
                        : 'bg-white border-slate-200/70 hover:bg-slate-50 text-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <GripVertical className="h-3.5 w-3.5 text-slate-400 shrink-0 cursor-grab" />
                      <Icon className={cn('h-4 w-4 shrink-0', isSelected ? 'text-[#1574fe]' : 'text-slate-500')} />
                      <span className="truncate">{mod.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModulesCatalog((prev) =>
                          prev.map((m) => (m.id === mod.id ? { ...m, enabled: !m.enabled } : m))
                        );
                        toast.success(`${mod.name} toggled`);
                      }}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ml-1.5',
                        mod.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2 (5 cols): Module Settings */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Module Settings</h3>
                <p className="text-xs text-slate-500">Configure selected module ({selectedModuleInConfig})</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Module Name & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Module Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={moduleSettingsForm.moduleName}
                    onChange={(e) => setModuleSettingsForm({ ...moduleSettingsForm, moduleName: e.target.value })}
                    className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setModuleSettingsForm({ ...moduleSettingsForm, status: !moduleSettingsForm.status })}
                      className={cn(
                        'w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        moduleSettingsForm.status ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                      {moduleSettingsForm.status ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Display Name & Module Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={moduleSettingsForm.displayName}
                    onChange={(e) => setModuleSettingsForm({ ...moduleSettingsForm, displayName: e.target.value })}
                    className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Module Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={moduleSettingsForm.moduleCode}
                    onChange={(e) => setModuleSettingsForm({ ...moduleSettingsForm, moduleCode: e.target.value })}
                    className="h-8.5 font-mono text-xs bg-white border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={moduleSettingsForm.description}
                  onChange={(e) => setModuleSettingsForm({ ...moduleSettingsForm, description: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#1574fe] resize-none"
                />
              </div>

              {/* Section: Module Access */}
              <div className="p-3 bg-slate-50/60 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Users className="h-3.5 w-3.5 text-[#1574fe]" />
                  <span>Module Access</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moduleSettingsForm.includeStandard}
                      onChange={() => setModuleSettingsForm({ ...moduleSettingsForm, includeStandard: !moduleSettingsForm.includeStandard })}
                      className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
                    />
                    <span className="text-slate-700">Include in Standard Edition</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moduleSettingsForm.includeEnterprise}
                      onChange={() => setModuleSettingsForm({ ...moduleSettingsForm, includeEnterprise: !moduleSettingsForm.includeEnterprise })}
                      className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
                    />
                    <span className="text-slate-700">Include in Enterprise Edition</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moduleSettingsForm.allowTrial}
                      onChange={() => setModuleSettingsForm({ ...moduleSettingsForm, allowTrial: !moduleSettingsForm.allowTrial })}
                      className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
                    />
                    <span className="text-slate-700">Allow in Trial</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moduleSettingsForm.allowFreeCore}
                      onChange={() => setModuleSettingsForm({ ...moduleSettingsForm, allowFreeCore: !moduleSettingsForm.allowFreeCore })}
                      className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
                    />
                    <span className="text-slate-700">Allow in Free Core</span>
                  </label>
                </div>
              </div>

              {/* Section: Module Preferences */}
              <div className="p-3 bg-slate-50/60 border border-slate-200/80 rounded-xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Settings className="h-3.5 w-3.5 text-[#1574fe]" />
                  <span>Module Preferences</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Default Lead Source</span>
                    <select
                      value={moduleSettingsForm.defaultLeadSource}
                      onChange={(e) => setModuleSettingsForm({ ...moduleSettingsForm, defaultLeadSource: e.target.value })}
                      className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden font-medium"
                    >
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Direct Walk-in">Direct Walk-in</option>
                      <option value="Social Media">Social Media</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Auto Lead Assignment</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModuleSettingsForm({ ...moduleSettingsForm, autoLeadAssignment: !moduleSettingsForm.autoLeadAssignment })}
                        className={cn(
                          'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                          moduleSettingsForm.autoLeadAssignment ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                        )}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                      </button>
                      <span className="text-[10px] font-bold text-slate-700">ON</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Enable Lead Scoring (AI)</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModuleSettingsForm({ ...moduleSettingsForm, enableLeadScoringAi: !moduleSettingsForm.enableLeadScoringAi })}
                        className={cn(
                          'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                          moduleSettingsForm.enableLeadScoringAi ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                        )}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                      </button>
                      <span className="text-[10px] font-bold text-slate-700">ON</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Enable Counselling Workflow</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModuleSettingsForm({ ...moduleSettingsForm, enableCounsellingWorkflow: !moduleSettingsForm.enableCounsellingWorkflow })}
                        className={cn(
                          'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                          moduleSettingsForm.enableCounsellingWorkflow ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                        )}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                      </button>
                      <span className="text-[10px] font-bold text-slate-700">ON</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 (4 cols): Features in this Module & Workflow */}
          <div className="lg:col-span-4 space-y-4">
            {/* Features in this Module (6) */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Features in this Module (6)</h3>
                    <p className="text-[11px] text-slate-500">Enable or disable features and set feature-level controls</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => toast.success('Add feature modal')}
                  className="bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs h-7 px-2.5 gap-1 rounded-md"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Feature</span>
                </Button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2 px-2.5 w-6 text-center">#</th>
                      <th className="py-2 px-2.5">Feature Name</th>
                      <th className="py-2 px-2.5">Configuration</th>
                      <th className="py-2 px-2.5 text-center w-12">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {moduleFeaturesList.map((f, idx) => {
                      const Icon = f.icon;
                      return (
                        <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2 px-2.5 text-center text-slate-500 font-semibold text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-2.5 font-semibold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Icon className="h-3.5 w-3.5 text-blue-600" />
                              <span>{f.name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-2.5 text-[11px] text-slate-600">
                            {f.config}
                          </td>
                          <td className="py-2 px-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setModuleFeaturesList((prev) =>
                                  prev.map((item) => (item.id === f.id ? { ...item, status: !item.status } : item))
                                );
                                toast.success(`${f.name} updated`);
                              }}
                              className={cn(
                                'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                                f.status ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                              )}
                            >
                              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workflow (Optional) Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#1574fe] rounded-lg">
                  <GitFork className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Workflow (Optional)</h4>
                  <p className="text-[11px] text-slate-500">Configure approval workflow for admission</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('workflow')}
                className="text-xs h-7.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 gap-1.5"
              >
                <Edit2 className="h-3 w-3 text-slate-500" />
                <span>Configure Workflow</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 3: FEATURE CONTROLS (Image 1 from new upload)
         ============================================================== */}
      {activeTab === 'features' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (3 cols): Select Module list */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <ToggleRight className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Feature Controls</h3>
                <p className="text-[11px] text-slate-500">Enable/disable features, set access and usage controls</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800 mb-2">Select Module</p>
              <div className="space-y-1">
                {[
                  { name: 'Admission & Enquiry', icon: Users },
                  { name: 'Student Management', icon: BookOpen },
                  { name: 'Fees & Payments', icon: CreditCard },
                  { name: 'Attendance', icon: Calendar },
                  { name: 'Timetable', icon: Calendar },
                  { name: 'Assessment & Exams', icon: ClipboardList },
                  { name: 'Homework & Assignments', icon: BookOpen },
                  { name: 'Communication', icon: Megaphone },
                  { name: 'Reports & Analytics', icon: BarChart2 },
                  { name: 'Portals (Student/Parent/Teacher)', icon: Users },
                ].map((mod) => {
                  const Icon = mod.icon;
                  const isSelected = selectedFeatureControlModule === mod.name;
                  return (
                    <button
                      key={mod.name}
                      type="button"
                      onClick={() => setSelectedFeatureControlModule(mod.name)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-medium transition-all text-left cursor-pointer',
                        isSelected
                          ? 'bg-blue-100/70 text-[#0d62e0] font-bold border border-blue-200 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700'
                      )}
                    >
                      <Icon className={cn('h-3.5 w-3.5 shrink-0', isSelected ? 'text-[#1574fe]' : 'text-slate-500')} />
                      <span className="truncate">{mod.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (9 cols): Feature Controls Table + 3 Bottom Cards */}
          <div className="lg:col-span-9 space-y-4">
            {/* Main Table Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedFeatureControlModule} – Feature Controls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage feature availability, permissions, usage limits and advanced options
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 w-8 text-center">#</th>
                      <th className="py-2.5 px-3">Feature</th>
                      <th className="py-2.5 px-3 text-center w-14">Status</th>
                      <th className="py-2.5 px-3">Access Control</th>
                      <th className="py-2.5 px-3">Usage / Limits</th>
                      <th className="py-2.5 px-3 text-center">Configuration</th>
                      <th className="py-2.5 px-3 text-center w-12">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {featureControls.map((fc, idx) => {
                      const Icon = fc.icon;
                      return (
                        <tr key={fc.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-blue-600" />
                              <span className="font-semibold text-slate-900">{fc.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setFeatureControls((prev) =>
                                  prev.map((item) => (item.id === fc.id ? { ...item, enabled: !item.enabled } : item))
                                );
                                toast.success(`${fc.name} status updated`);
                              }}
                              className={cn(
                                'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto',
                                fc.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                              )}
                            >
                              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                            </button>
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={fc.accessControl}
                              onChange={(e) => {
                                setFeatureControls((prev) =>
                                  prev.map((item) => (item.id === fc.id ? { ...item, accessControl: e.target.value } : item))
                                );
                              }}
                              className="h-7.5 px-2.5 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden text-xs w-full max-w-[150px]"
                            >
                              <option value="All Users">All Users</option>
                              <option value="Admissions Team">Admissions Team</option>
                              <option value="Counsellor">Counsellor</option>
                              <option value="Admin + Admissions">Admin + Admissions</option>
                              <option value="Admin Only">Admin Only</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            <Input
                              value={fc.limits}
                              onChange={(e) => {
                                setFeatureControls((prev) =>
                                  prev.map((item) => (item.id === fc.id ? { ...item, limits: e.target.value } : item))
                                );
                              }}
                              className="h-7.5 text-xs bg-white border-slate-200 rounded-md max-w-[140px]"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info(`Configuring ${fc.name}`)}
                              className="h-7 px-2.5 text-xs font-medium text-slate-700 bg-white border-slate-200 hover:bg-slate-50 gap-1 rounded-md"
                            >
                              <Settings className="h-3 w-3 text-[#1574fe]" />
                              <span>Configure</span>
                            </Button>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => toast.info(`Editing ${fc.name}`)}
                              className="p-1 rounded-md text-slate-500 hover:text-[#1574fe] hover:bg-slate-100 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom 3 Cards matching Image 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-2.5">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Zap className="h-4 w-4 text-[#1574fe]" />
                  <h4 className="text-xs font-bold text-slate-900">Quick Actions</h4>
                </div>
                <div className="space-y-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFeatureControls((prev) => prev.map((item) => ({ ...item, enabled: true })));
                      toast.success('All features enabled');
                    }}
                    className="w-full h-8 text-xs font-medium border-emerald-500 text-emerald-700 hover:bg-emerald-50 justify-start gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Enable All Features</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFeatureControls((prev) => prev.map((item) => ({ ...item, enabled: false })));
                      toast.info('All features disabled');
                    }}
                    className="w-full h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 justify-start gap-1.5"
                  >
                    <XCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>Disable All Features</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info('Reset to edition defaults')}
                    className="w-full h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 justify-start gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Reset to Edition Defaults</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info('Copying from another edition')}
                    className="w-full h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 justify-start gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy from Another Edition</span>
                  </Button>
                </div>
              </div>

              {/* Feature Settings Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Settings className="h-4 w-4 text-[#1574fe]" />
                  <h4 className="text-xs font-bold text-slate-900">Feature Settings</h4>
                </div>
                <div className="space-y-3 text-xs pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Allow feature customization by tenant</span>
                    <button
                      type="button"
                      onClick={() => setTenantFeatureCustomization(!tenantFeatureCustomization)}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        tenantFeatureCustomization ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Show feature in tenant settings</span>
                    <button
                      type="button"
                      onClick={() => setShowFeatureInTenantSettings(!showFeatureInTenantSettings)}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        showFeatureInTenantSettings ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Log feature usage (audit trail)</span>
                    <button
                      type="button"
                      onClick={() => setLogFeatureUsageAuditTrail(!logFeatureUsageAuditTrail)}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        logFeatureUsageAuditTrail ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature Access Matrix Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <Users className="h-4 w-4 text-[#1574fe]" />
                    <h4 className="text-xs font-bold text-slate-900">Feature Access Matrix</h4>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    View and manage feature access by user role
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => toast.success('Opening Access Matrix modal')}
                  className="w-full bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs h-9 font-medium rounded-lg gap-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Manage Access Matrix</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 4: WORKFLOWS & APPROVALS (Image 4 from turn 2 & turn 3)
         ============================================================== */}
      {activeTab === 'workflow' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (3 cols): Workflows List (12) */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Workflow className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Workflows (12)</h3>
                  <p className="text-[11px] text-slate-500">Create, edit and manage workflows</p>
                </div>
              </div>

              <div className="space-y-1">
                {[
                  { name: 'Student Admission', active: true, icon: GraduationCap },
                  { name: 'Fee Concession Approval', active: true, icon: CreditCard },
                  { name: 'Leave Application', active: true, icon: Calendar },
                  { name: 'Purchase Request', active: true, icon: FileText },
                  { name: 'Vendor Onboarding', active: false, icon: Users },
                  { name: 'Document Verification', active: true, icon: FileCheck },
                ].map((wf) => {
                  const Icon = wf.icon;
                  const isSelected = selectedWorkflow === wf.name;
                  return (
                    <div
                      key={wf.name}
                      onClick={() => setSelectedWorkflow(wf.name)}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all cursor-pointer',
                        isSelected
                          ? 'bg-blue-50/80 border-blue-200 text-[#0d62e0] font-bold shadow-2xs'
                          : 'bg-white border-slate-200/70 hover:bg-slate-50 text-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={cn('h-3.5 w-3.5', isSelected ? 'text-[#1574fe]' : 'text-slate-500')} />
                        <span className="truncate">{wf.name}</span>
                      </div>
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0',
                          wf.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {wf.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => toast.success('Create new workflow modal')}
                className="w-full text-xs h-8 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Workflow</span>
              </Button>
            </div>

            {/* Center Canvas (6 cols): Visual Flowchart Builder */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                    <GitFork className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Workflow Builder – {selectedWorkflow}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 gap-1 bg-white border-slate-200">
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 gap-1 bg-white border-slate-200">
                    <Play className="h-3 w-3 text-[#1574fe]" />
                    <span>Test</span>
                  </Button>
                  <Button size="sm" className="h-7 text-xs px-2.5 gap-1 bg-[#1574fe] text-white">
                    <Upload className="h-3 w-3" />
                    <span>Publish</span>
                  </Button>
                </div>
              </div>

              {/* Visual Flowchart Canvas matching screenshots */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/70 overflow-x-auto min-h-[220px] flex items-center justify-center">
                <div className="flex items-center gap-3">
                  {/* Step 1: Start Application Submitted */}
                  <div className="p-2.5 px-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center shadow-xs">
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-600 mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-emerald-800">Start</p>
                    <p className="text-[9px] text-emerald-700">Application Submitted</p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

                  {/* Step 2: Verify Documents */}
                  <div className="p-2.5 px-3 bg-blue-50 border border-blue-300 rounded-xl text-center shadow-xs">
                    <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-blue-800">Verify Documents</p>
                    <p className="text-[9px] text-blue-600">(Admission Team)</p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

                  {/* Step 3: Decision Diamond */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-amber-50 border border-amber-300 rotate-45 flex items-center justify-center shadow-xs">
                      <div className="-rotate-45 text-center">
                        <p className="text-[9px] font-bold text-amber-900 leading-tight">Documents<br />Valid?</p>
                      </div>
                    </div>
                    {/* Yes arrow label */}
                    <span className="absolute -top-1 -right-4 text-[9px] font-bold text-emerald-600 bg-white px-1 border border-emerald-200 rounded">
                      Yes
                    </span>
                    {/* No branch */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="text-[9px] font-bold text-red-600 bg-white px-1 border border-red-200 rounded mb-1">
                        No
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />

                  {/* Step 4: Approval */}
                  <div className="p-2.5 px-3 bg-purple-50 border border-purple-300 rounded-xl text-center shadow-xs">
                    <Users className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-purple-800">Approval</p>
                    <p className="text-[9px] text-purple-600">(Principal)</p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

                  {/* Step 5: Enrolment */}
                  <div className="p-2.5 px-3 bg-blue-50 border border-blue-300 rounded-xl text-center shadow-xs">
                    <GraduationCap className="h-4 w-4 text-[#1574fe] mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-[#0d62e0]">Enrolment</p>
                    <p className="text-[9px] text-[#1574fe]">Create Student & Section</p>
                  </div>

                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (3 cols): Workflow Settings */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Settings className="h-4 w-4 text-[#1574fe]" />
                <h3 className="text-sm font-bold text-slate-900">Workflow Settings</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Workflow Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={workflowSettings.name}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, name: e.target.value })}
                    className="h-7.5 text-xs bg-white border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Module <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={workflowSettings.module}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, module: e.target.value })}
                    className="w-full h-7.5 px-2 text-xs bg-white border border-slate-200 rounded-md outline-hidden text-slate-700"
                  >
                    <option value="Admission & Enquiry">Admission & Enquiry</option>
                    <option value="Fees & Payments">Fees & Payments</option>
                    <option value="Student Management">Student Management</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Applies To <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={workflowSettings.appliesTo}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, appliesTo: e.target.value })}
                    className="w-full h-7.5 px-2 text-xs bg-white border border-slate-200 rounded-md outline-hidden text-slate-700"
                  >
                    <option value="New Admission">New Admission</option>
                    <option value="Transfer Admission">Transfer Admission</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-700 font-medium">Active Workflow</span>
                  <button
                    type="button"
                    onClick={() => setWorkflowSettings({ ...workflowSettings, isActive: !workflowSettings.isActive })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      workflowSettings.isActive ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">Email Notifications</span>
                  <button
                    type="button"
                    onClick={() => setWorkflowSettings({ ...workflowSettings, emailNotifications: !workflowSettings.emailNotifications })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      workflowSettings.emailNotifications ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">SLA Monitoring</span>
                  <button
                    type="button"
                    onClick={() => setWorkflowSettings({ ...workflowSettings, slaMonitoring: !workflowSettings.slaMonitoring })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      workflowSettings.slaMonitoring ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Approval Matrix & Automations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Approval Matrix (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Users className="h-4 w-4 text-[#1574fe]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Approval Matrix</h4>
                  <p className="text-[11px] text-slate-500">Define approval levels, approvers and conditions</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2 px-2.5 w-6 text-center">#</th>
                      <th className="py-2 px-2.5">Approval Level</th>
                      <th className="py-2 px-2.5">Approver Role</th>
                      <th className="py-2 px-2.5">Condition / Limit</th>
                      <th className="py-2 px-2.5 text-center w-14">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approvalMatrix.map((ap, idx) => (
                      <tr key={ap.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-2.5 text-center text-slate-500 font-semibold text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-2.5 font-semibold text-slate-900">{ap.level}</td>
                        <td className="py-2 px-2.5 text-slate-700">{ap.approver}</td>
                        <td className="py-2 px-2.5 text-slate-600 font-mono text-[11px]">{ap.condition}</td>
                        <td className="py-2 px-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" className="p-1 text-slate-500 hover:text-[#1574fe]">
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button type="button" className="p-1 text-red-500 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Automations & Actions (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Zap className="h-4 w-4 text-[#1574fe]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Automation & Actions</h4>
                  <p className="text-[11px] text-slate-500">Define automated actions at each stage</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {automations.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={a.checked}
                      onChange={() =>
                        setAutomations((prev) =>
                          prev.map((item) => (item.id === a.id ? { ...item, checked: !item.checked } : item))
                        )
                      }
                      className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
                    />
                    <span>{a.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 5: INTEGRATIONS (Image 3 from previous)
         ============================================================== */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left 8 cols: Available Integrations & Flow Diagram */}
            <div className="lg:col-span-8 space-y-4">
              {/* Card 1: Available Integrations */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-50 text-[#6366f1] rounded-xl">
                      <LayoutGrid className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Available Integrations</h3>
                      <p className="text-xs text-slate-500">Connect and enable integrations for your edition</p>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
                    {['All (12)', 'Communication', 'Payments', 'Identity & Access', 'Productivity', 'Others'].map((cat) => {
                      const cleanCat = cat.replace(' (12)', '');
                      const isSelected =
                        integrationCategory === cleanCat ||
                        (cat === 'All (12)' && integrationCategory === 'All');
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setIntegrationCategory(cleanCat)}
                          className={cn(
                            'px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap',
                            isSelected
                              ? 'bg-[#6366f1] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          )}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 10 Integration Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                  {[
                    {
                      id: 'int-1',
                      name: 'WhatsApp Business (Cloud API)',
                      desc: 'Send notifications, alerts and follow-ups',
                      connected: true,
                      category: 'Communication',
                      iconEl: (
                        <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                          <MessageSquare className="h-4.5 w-4.5 fill-current" />
                        </div>
                      ),
                    },
                    {
                      id: 'int-2',
                      name: 'Email (SMTP)',
                      desc: 'Transactional & bulk emails (e.g., GoDaddy)',
                      connected: true,
                      category: 'Communication',
                      iconEl: (
                        <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] text-white flex items-center justify-center shadow-xs">
                          <Mail className="h-4.5 w-4.5" />
                        </div>
                      ),
                    },
                    {
                      id: 'int-3',
                      name: 'SMS Gateway',
                      desc: 'OTP, alerts and notifications',
                      connected: false,
                      category: 'Communication',
                      iconEl: (
                        <div className="w-8 h-8 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center shadow-xs font-bold text-[10px]">
                          SMS
                        </div>
                      ),
                    },
                    {
                      id: 'int-4',
                      name: 'Payment Gateway',
                      desc: 'Online fee & invoice payments (Razorpay / PayU / Stripe)',
                      connected: true,
                      category: 'Payments',
                      iconEl: (
                        <div className="w-8 h-8 rounded-lg bg-[#0284c7] text-white flex items-center justify-center shadow-xs">
                          <CreditCard className="h-4.5 w-4.5" />
                        </div>
                      ),
                    },
                    {
                      id: 'int-5',
                      name: 'Biometric Attendance (ZKTeco)',
                      desc: 'Integrate attendance devices (ZKTeco)',
                      connected: true,
                      category: 'Productivity',
                      iconEl: (
                        <div className="w-8 h-8 rounded-full bg-[#6366f1] text-white flex items-center justify-center shadow-xs">
                          <Fingerprint className="h-4.5 w-4.5" />
                        </div>
                      ),
                    },
                    {
                      id: 'int-6',
                      name: 'Microsoft Entra ID (Azure AD)',
                      desc: 'Single sign-on (SSO) & user sync',
                      connected: true,
                      category: 'Identity & Access',
                      iconEl: (
                        <div className="w-8 h-8 rounded-lg bg-[#00a4ef] flex items-center justify-center shadow-xs p-1.5">
                          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                            <div className="bg-white rounded-[1px]" />
                            <div className="bg-white rounded-[1px]" />
                            <div className="bg-white rounded-[1px]" />
                            <div className="bg-white rounded-[1px]" />
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: 'int-7',
                      name: 'Google Workspace',
                      desc: 'SSO, Calendar, Drive and Gmail integration',
                      connected: false,
                      category: 'Identity & Access',
                      iconEl: (
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                          <span className="font-extrabold text-[#ea4335] text-base leading-none">G</span>
                        </div>
                      ),
                    },
                    {
                      id: 'int-8',
                      name: 'Slack',
                      desc: 'Team notifications and alerts',
                      connected: false,
                      category: 'Productivity',
                      iconEl: (
                        <div className="w-8 h-8 rounded-lg bg-[#4A154B] text-white flex items-center justify-center shadow-xs font-bold text-base">
                          #
                        </div>
                      ),
                    },
                    {
                      id: 'int-9',
                      name: 'LinkedIn Ads & Leads',
                      desc: 'Capture and sync leads from LinkedIn',
                      connected: true,
                      category: 'Communication',
                      iconEl: (
                        <div className="w-8 h-8 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center shadow-xs font-bold text-xs">
                          in
                        </div>
                      ),
                    },
                    {
                      id: 'int-10',
                      name: 'Meta (Facebook / Instagram)',
                      desc: 'Lead capture from FB & Instagram forms',
                      connected: true,
                      category: 'Communication',
                      iconEl: (
                        <div className="w-8 h-8 rounded-lg bg-[#0081fb] text-white flex items-center justify-center shadow-xs">
                          <span className="text-sm font-bold leading-none">∞</span>
                        </div>
                      ),
                    },
                  ]
                    .filter((item) => integrationCategory === 'All' || item.category === integrationCategory)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-slate-200/90 rounded-2xl bg-white hover:border-purple-200 transition-all flex flex-col justify-between gap-2.5 shadow-2xs"
                      >
                        <div className="space-y-1.5">
                          {item.iconEl}
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.name}</h4>
                          <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{item.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              toast.success(`${item.name} status updated`);
                            }}
                            className={cn(
                              'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0',
                              item.connected ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                            )}
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                          </button>
                          <span
                            className={cn(
                              'text-[10px] font-semibold whitespace-nowrap',
                              item.connected ? 'text-slate-800' : 'text-slate-500'
                            )}
                          >
                            {item.connected ? 'Connected' : 'Not Configured'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Bottom Row: REST API & Webhooks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 border border-slate-200/90 rounded-2xl bg-slate-50/40 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-50 text-[#6366f1] font-mono text-xs font-bold">
                        &lt;/&gt;
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">REST API</h4>
                        <p className="text-[10px] text-slate-500">Programmatic access to Pegatto data</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-4.5 flex items-center rounded-full p-0.5 bg-emerald-500 justify-end cursor-pointer">
                        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800">Enabled</span>
                    </div>
                  </div>

                  <div className="p-3 border border-slate-200/90 rounded-2xl bg-slate-50/40 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-50 text-[#6366f1]">
                        <GitFork className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Webhooks</h4>
                        <p className="text-[10px] text-slate-500">Real-time event notifications to external apps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-4.5 flex items-center rounded-full p-0.5 bg-emerald-500 justify-end cursor-pointer">
                        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Integration Flow (Example) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="p-2 bg-purple-50 text-[#6366f1] rounded-xl">
                    <GitFork className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Integration Flow (Example)</h3>
                    <p className="text-xs text-slate-500">How data and events flow between Pegatto and external systems</p>
                  </div>
                </div>

                {/* Visual Flow diagram matching screenshot */}
                <div className="py-4 px-2 flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6">
                  {/* Step 1: Lead Capture */}
                  <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-2xl flex items-center gap-3 shadow-2xs min-w-[200px]">
                    <div className="p-2 rounded-xl bg-purple-100 text-[#6366f1]">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Lead Capture</div>
                      <div className="text-[10px] text-slate-500">(Website / FB / LinkedIn)</div>
                    </div>
                  </div>

                  {/* Arrow 1 */}
                  <div className="text-[#6366f1] font-bold text-lg hidden md:block">
                    <ArrowRight className="h-5 w-5" />
                  </div>

                  {/* Center Node: Pegatto */}
                  <div className="px-6 py-4 bg-[#6366f1] text-white rounded-2xl shadow-md flex items-center gap-2.5 shrink-0">
                    <img
                      src="/pegatto_logo.png"
                      alt="Pegatto"
                      className="h-6 w-auto brightness-0 invert object-contain"
                    />
                    <span className="font-extrabold text-base tracking-tight">Pegatto®</span>
                  </div>

                  {/* Arrow 2 */}
                  <div className="text-[#6366f1] font-bold text-lg hidden md:block">
                    <ArrowRight className="h-5 w-5" />
                  </div>

                  {/* Step 3: Branching outputs */}
                  <div className="space-y-2 w-full md:w-auto">
                    <div className="px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl flex items-center gap-2.5 shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                        <MessageSquare className="h-3 w-3 fill-current" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        Follow-up (WhatsApp / Email / SMS)
                      </span>
                    </div>

                    <div className="px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl flex items-center gap-2.5 shadow-2xs">
                      <div className="w-5 h-5 rounded-md bg-[#0284c7] text-white flex items-center justify-center shrink-0">
                        <CreditCard className="h-3 w-3" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        Fee Payment (Payment Gateway)
                      </span>
                    </div>

                    <div className="px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl flex items-center gap-2.5 shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-[#6366f1] text-white flex items-center justify-center shrink-0">
                        <Fingerprint className="h-3 w-3" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        Attendance Sync (ZKTeco)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 cols: Configured Integrations & API/Webhooks */}
            <div className="lg:col-span-4 space-y-4">
              {/* Configured Integrations Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="p-1.5 bg-purple-50 text-[#6366f1] rounded-lg">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Configured Integrations (6)</h4>
                  </div>
                </div>

                <div className="overflow-hidden border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                        <th className="py-2.5 px-3 w-6 text-center font-bold">#</th>
                        <th className="py-2.5 px-3 font-bold">Integration</th>
                        <th className="py-2.5 px-3 text-center font-bold">Status</th>
                        <th className="py-2.5 px-3 font-bold">Last Sync</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {[
                        {
                          id: 1,
                          name: 'WhatsApp Business',
                          status: 'Active',
                          time: '18 Nov 2026, 10:24 AM',
                          icon: (
                            <div className="w-4 h-4 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                              <MessageSquare className="h-2.5 w-2.5 fill-current" />
                            </div>
                          ),
                        },
                        {
                          id: 2,
                          name: 'Payment Gateway',
                          status: 'Active',
                          time: '18 Nov 2026, 09:50 AM',
                          icon: (
                            <div className="w-4 h-4 rounded bg-[#0284c7] text-white flex items-center justify-center shrink-0">
                              <CreditCard className="h-2.5 w-2.5" />
                            </div>
                          ),
                        },
                        {
                          id: 3,
                          name: 'ZKTeco Attendance',
                          status: 'Active',
                          time: '18 Nov 2026, 08:15 AM',
                          icon: (
                            <div className="w-4 h-4 rounded-full bg-[#6366f1] text-white flex items-center justify-center shrink-0">
                              <Fingerprint className="h-2.5 w-2.5" />
                            </div>
                          ),
                        },
                        {
                          id: 4,
                          name: 'Microsoft Entra ID',
                          status: 'Active',
                          time: '17 Nov 2026, 06:40 PM',
                          icon: (
                            <div className="w-4 h-4 rounded bg-[#00a4ef] flex items-center justify-center shrink-0 p-0.5">
                              <div className="grid grid-cols-2 gap-0.5 w-2.5 h-2.5">
                                <div className="bg-white rounded-[0.5px]" />
                                <div className="bg-white rounded-[0.5px]" />
                                <div className="bg-white rounded-[0.5px]" />
                                <div className="bg-white rounded-[0.5px]" />
                              </div>
                            </div>
                          ),
                        },
                        {
                          id: 5,
                          name: 'LinkedIn Leads',
                          status: 'Active',
                          time: '17 Nov 2026, 02:10 PM',
                          icon: (
                            <div className="w-4 h-4 rounded bg-[#0a66c2] text-white flex items-center justify-center shrink-0 text-[8px] font-bold">
                              in
                            </div>
                          ),
                        },
                        {
                          id: 6,
                          name: 'REST API',
                          status: 'Active',
                          time: '17 Nov 2026, 11:05 AM',
                          icon: (
                            <div className="w-4 h-4 rounded bg-slate-800 text-white flex items-center justify-center shrink-0 text-[8px] font-mono font-bold">
                              &lt;/&gt;
                            </div>
                          ),
                        },
                      ].map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                            {row.id}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                            {row.icon}
                            <span>{row.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#dcfce7] text-[#15803d]">
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-600 font-mono whitespace-nowrap">
                            {row.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* API & Webhooks Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <div className="p-1.5 bg-purple-50 text-[#6366f1] rounded-lg">
                    <Code className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">API &amp; Webhooks</h4>
                    <p className="text-xs text-slate-500">Manage API keys, webhooks and developer access</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info('API Keys management')}
                    className="h-9 text-xs bg-white border-purple-200 text-[#6366f1] hover:bg-purple-50 font-semibold gap-1.5 rounded-xl cursor-pointer"
                  >
                    <Key className="h-3.5 w-3.5" />
                    <span>API Keys</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info('Webhook events management')}
                    className="h-9 text-xs bg-white border-purple-200 text-[#6366f1] hover:bg-purple-50 font-semibold gap-1.5 rounded-xl cursor-pointer"
                  >
                    <Webhook className="h-3.5 w-3.5" />
                    <span>Webhook Events</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 6: BRANDING & UI (Image 2 from turn 3)
         ============================================================== */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Top-Left Card: Brand Identity */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Brand Identity</h3>
                <p className="text-xs text-slate-500">Set product logo, name and brand elements</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Product Logo */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Product Logo <span className="text-red-500">*</span>
                </label>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 px-2.5 bg-blue-50 rounded-lg flex items-center gap-1.5 font-bold text-[#1574fe] text-sm">
                      <GraduationCap className="h-4 w-4" />
                      <span>Pegatto Education</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7.5 px-3 text-xs bg-white border-slate-200 gap-1.5"
                    >
                      <Upload className="h-3 w-3 text-slate-500" />
                      <span>Upload</span>
                    </Button>
                    <button type="button" className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">Recommended: PNG/SVG, 300×80 px</p>
              </div>

              {/* Favicon */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Favicon</label>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/30 flex items-center justify-between gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1574fe]">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7.5 px-3 text-xs bg-white border-slate-200 gap-1.5"
                    >
                      <Upload className="h-3 w-3 text-slate-500" />
                      <span>Upload</span>
                    </Button>
                    <button type="button" className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={brandingForm.productName}
                  onChange={(e) => setBrandingForm({ ...brandingForm, productName: e.target.value })}
                  className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tagline</label>
                <Input
                  value={brandingForm.tagline}
                  onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                  className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Top-Right Card: Theme & Colors + UI Layout Settings */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            {/* Theme & Colors Section */}
            <div>
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Theme & Colors</h3>
                  <p className="text-xs text-slate-500">Define brand colors and UI theme</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 px-2 bg-white">
                      <input
                        type="color"
                        value={brandingForm.primaryColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                      />
                      <span className="font-mono text-xs uppercase text-slate-700">{brandingForm.primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 px-2 bg-white">
                      <input
                        type="color"
                        value={brandingForm.secondaryColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, secondaryColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                      />
                      <span className="font-mono text-xs uppercase text-slate-700">{brandingForm.secondaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 px-2 bg-white">
                      <input
                        type="color"
                        value={brandingForm.accentColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, accentColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                      />
                      <span className="font-mono text-xs uppercase text-slate-700">{brandingForm.accentColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 px-2 bg-white">
                      <input
                        type="color"
                        value={brandingForm.textColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, textColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                      />
                      <span className="font-mono text-xs uppercase text-slate-700">{brandingForm.textColor}</span>
                    </div>
                  </div>
                </div>

                {/* Live UI Mockup Preview */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                  <div
                    className="p-2 text-white text-[11px] font-bold flex items-center justify-between"
                    style={{ backgroundColor: brandingForm.primaryColor }}
                  >
                    <span>Pegatto Education</span>
                  </div>
                  <div className="flex h-20 text-[10px]">
                    <div className="w-20 bg-slate-800 text-slate-300 p-1.5 space-y-1">
                      <p className="text-white font-bold">Dashboard</p>
                      <p>Admissions</p>
                      <p>Students</p>
                    </div>
                    <div className="flex-1 p-2 bg-slate-50 space-y-1.5">
                      <div className="h-4 bg-white rounded border border-slate-200" />
                      <div className="flex items-end gap-1 h-8 pt-2">
                        <div className="w-2 h-3 bg-blue-300 rounded-t" />
                        <div className="w-2 h-5 bg-blue-500 rounded-t" />
                        <div className="w-2 h-7 bg-[#0d62e0] rounded-t" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UI & Layout Settings Section */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="p-1 bg-blue-50 text-[#1574fe] rounded-md">
                  <Monitor className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">UI & Layout Settings</h4>
                  <p className="text-[11px] text-slate-500">Configure the look, feel and layout</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">Compact Menu</span>
                    <button
                      type="button"
                      onClick={() => setBrandingForm({ ...brandingForm, compactMenu: !brandingForm.compactMenu })}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        brandingForm.compactMenu ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">Show Module Icons</span>
                    <button
                      type="button"
                      onClick={() => setBrandingForm({ ...brandingForm, showModuleIcons: !brandingForm.showModuleIcons })}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        brandingForm.showModuleIcons ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">Rounded UI (Modern Look)</span>
                    <button
                      type="button"
                      onClick={() => setBrandingForm({ ...brandingForm, roundedUi: !brandingForm.roundedUi })}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        brandingForm.roundedUi ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">Enable Dark Mode</span>
                    <button
                      type="button"
                      onClick={() => setBrandingForm({ ...brandingForm, enableDarkMode: !brandingForm.enableDarkMode })}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        brandingForm.enableDarkMode ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">Enable Product Logo in Login</span>
                    <button
                      type="button"
                      onClick={() =>
                        setBrandingForm({
                          ...brandingForm,
                          enableProductLogoInLogin: !brandingForm.enableProductLogoInLogin,
                        })
                      }
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        brandingForm.enableProductLogoInLogin ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                </div>

                {/* 3 Layout selectors */}
                <div className="grid grid-cols-3 gap-2">
                  <div
                    onClick={() => setBrandingForm({ ...brandingForm, layoutStyle: 'modern' })}
                    className={cn(
                      'p-2 rounded-xl border text-center cursor-pointer transition-all flex flex-col justify-between h-20',
                      brandingForm.layoutStyle === 'modern'
                        ? 'border-[#1574fe] bg-blue-50/30 ring-1 ring-[#1574fe]'
                        : 'border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <div className="w-full h-8 bg-slate-100 rounded-md" />
                    <span className="text-[10px] font-bold text-slate-800">Modern</span>
                  </div>

                  <div
                    onClick={() => setBrandingForm({ ...brandingForm, layoutStyle: 'classic' })}
                    className={cn(
                      'p-2 rounded-xl border text-center cursor-pointer transition-all flex flex-col justify-between h-20',
                      brandingForm.layoutStyle === 'classic'
                        ? 'border-[#1574fe] bg-blue-50/30 ring-1 ring-[#1574fe]'
                        : 'border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <div className="w-full h-8 bg-slate-100 rounded-none border border-slate-300" />
                    <span className="text-[10px] font-bold text-slate-800">Classic</span>
                  </div>

                  <div
                    onClick={() => setBrandingForm({ ...brandingForm, layoutStyle: 'minimal' })}
                    className={cn(
                      'p-2 rounded-xl border text-center cursor-pointer transition-all flex flex-col justify-between h-20',
                      brandingForm.layoutStyle === 'minimal'
                        ? 'border-[#1574fe] bg-blue-50/30 ring-1 ring-[#1574fe]'
                        : 'border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <div className="w-full h-8 bg-white border-b border-slate-300" />
                    <span className="text-[10px] font-bold text-slate-800">Minimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Left Card: Login & Portal Branding */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Login & Portal Branding</h3>
                <p className="text-xs text-slate-500">Customize login screen and user portals</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Login screen preview */}
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
                <div className="p-3 bg-white rounded-lg shadow-xs w-full max-w-[180px] space-y-2">
                  <div className="font-bold text-[#1574fe] text-xs flex items-center justify-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    <span>Pegatto Education</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded" />
                  <button type="button" className="w-full py-1 bg-[#1574fe] text-white text-[10px] rounded font-semibold">
                    Login
                  </button>
                </div>
              </div>

              {/* Options Checklist */}
              <div className="space-y-2.5">
                {[
                  { key: 'useCustomLoginBackground', label: 'Use Custom Login Background' },
                  { key: 'showProductTagline', label: 'Show Product Tagline' },
                  { key: 'displayEditionName', label: 'Display Edition Name' },
                  { key: 'showHelpSupportLink', label: 'Show Help & Support Link' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(brandingForm as any)[item.key]}
                      onChange={() =>
                        setBrandingForm({
                          ...brandingForm,
                          [item.key]: !(brandingForm as any)[item.key],
                        })
                      }
                      className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4 cursor-pointer"
                    />
                    <span className="text-xs text-slate-800 font-medium">{item.label}</span>
                  </label>
                ))}

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 text-xs bg-white border-slate-200 gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5 text-slate-600" />
                    <span>Upload Background</span>
                  </Button>
                  <p className="text-[10px] text-slate-400 mt-1">Recommended: 1920 × 1080 px</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Right Card: Portal Experience (Multi-Role) */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Portal Experience (Multi-Role)</h3>
                <p className="text-xs text-slate-500">Personalize user portals for different roles</p>
              </div>
            </div>

            {/* 4 Portals in 4 columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-2 text-center">
                <div className="h-6 bg-purple-100 text-purple-700 rounded-md flex items-center justify-center font-bold text-[10px]">
                  Student Portal
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-100 mx-auto" />
                <div className="h-2 bg-slate-100 rounded w-3/4 mx-auto" />
              </div>

              <div className="p-2.5 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-2 text-center">
                <div className="h-6 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center font-bold text-[10px]">
                  Parent Portal
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-100 mx-auto" />
                <div className="h-2 bg-slate-100 rounded w-3/4 mx-auto" />
              </div>

              <div className="p-2.5 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-2 text-center">
                <div className="h-6 bg-emerald-100 text-emerald-700 rounded-md flex items-center justify-center font-bold text-[10px]">
                  Teacher Portal
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-100 mx-auto" />
                <div className="h-2 bg-slate-100 rounded w-3/4 mx-auto" />
              </div>

              <div className="p-2.5 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-2 text-center">
                <div className="h-6 bg-amber-100 text-amber-700 rounded-md flex items-center justify-center font-bold text-[10px]">
                  Admin Portal
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-100 mx-auto" />
                <div className="h-2 bg-slate-100 rounded w-3/4 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 7: ADVANCED (Image 4 from new upload)
         ============================================================== */}
      {activeTab === 'advanced' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200/80">
            <Sliders className="h-5 w-5 text-[#1574fe]" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Advanced</h2>
              <p className="text-xs text-slate-500">
                Advanced configuration, security, performance and platform controls
              </p>
            </div>
          </div>

          {/* 3x3 Grid of 9 Cards matching Image 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {/* Card 1: Security & Access */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Security & Access</h3>
                  <p className="text-[11px] text-slate-500">Enhance platform security and access control</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Multi-Factor Authentication (MFA)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, mfa: !advancedSettings.mfa })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.mfa ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>IP Access Restriction (Allowlist)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, ipAllowlist: !advancedSettings.ipAllowlist })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.ipAllowlist ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Password Policy & Expiry</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, passwordPolicy: !advancedSettings.passwordPolicy })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.passwordPolicy ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Session Timeout</span>
                  </span>
                  <select
                    value={advancedSettings.sessionTimeout}
                    onChange={(e) => setAdvancedSettings({ ...advancedSettings, sessionTimeout: e.target.value })}
                    className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden font-medium text-xs"
                  >
                    <option value="15 Minutes">15 Minutes</option>
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="4 Hours">4 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 2: Data Management */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Data Management</h3>
                  <p className="text-[11px] text-slate-500">Configure data handling, backup and retention</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Data Backup & Restore</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success('Initiating cloud backup...')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200 gap-1"
                  >
                    <Upload className="h-3 w-3 text-slate-500" />
                    <span>Backup Now</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Data Retention Policy</span>
                  </span>
                  <select
                    value={advancedSettings.dataRetentionPolicy}
                    onChange={(e) => setAdvancedSettings({ ...advancedSettings, dataRetentionPolicy: e.target.value })}
                    className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden font-medium text-xs"
                  >
                    <option value="6 Months">6 Months</option>
                    <option value="12 Months">12 Months</option>
                    <option value="24 Months">24 Months</option>
                    <option value="Forever">Forever</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Data Import / Export</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Import/Export Data modal')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200 gap-1"
                  >
                    <Upload className="h-3 w-3 text-slate-500" />
                    <span>Import / Export</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Trash2 className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Data Purge (Archive/Delete)</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Purge rules')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200 gap-1"
                  >
                    <Settings className="h-3 w-3 text-slate-500" />
                    <span>Configure</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 3: Performance & Scalability */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Rocket className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Performance & Scalability</h3>
                  <p className="text-[11px] text-slate-500">Optimize system performance and scalability</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Zap className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Caching (Redis)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, cachingRedis: !advancedSettings.cachingRedis })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.cachingRedis ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Background Jobs (Queue)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, backgroundJobs: !advancedSettings.backgroundJobs })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.backgroundJobs ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Code className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Auto Scaling (Cloud)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, autoScaling: !advancedSettings.autoScaling })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.autoScaling ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <BarChart2 className="h-3.5 w-3.5 text-indigo-500" />
                    <span>System Resource Limit</span>
                  </span>
                  <select
                    value={advancedSettings.systemResourceLimit}
                    onChange={(e) => setAdvancedSettings({ ...advancedSettings, systemResourceLimit: e.target.value })}
                    className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden font-medium text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Ultra">Ultra</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 4: AI & Automation */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">AI & Automation</h3>
                  <p className="text-[11px] text-slate-500">Configure AI features and automation settings</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { key: 'aiLeadScoring', label: 'Enable AI Lead Scoring' },
                  { key: 'aiSalesPrediction', label: 'Enable Sales Prediction' },
                  { key: 'aiCrmAssistant', label: 'Enable AI CRM Assistant (Chatbot)' },
                  { key: 'aiCallingAgent', label: 'Enable AI Calling Agent (Beta)' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer truncate">
                      <input
                        type="checkbox"
                        checked={(advancedSettings as any)[item.key]}
                        onChange={() =>
                          setAdvancedSettings({
                            ...advancedSettings,
                            [item.key]: !(advancedSettings as any)[item.key],
                          })
                        }
                        className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
                      />
                      <span className="text-slate-700 truncate">{item.label}</span>
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info(`Configuring ${item.label}`)}
                      className="h-6.5 text-[11px] px-2 bg-white border-slate-200 gap-1 shrink-0"
                    >
                      <Settings className="h-3 w-3 text-slate-500" />
                      <span>Configure</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5: Developer & API */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Code className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Developer & API</h3>
                  <p className="text-[11px] text-slate-500">API access, webhooks and developer settings</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Key className="h-3.5 w-3.5 text-indigo-500" />
                    <span>API Access & Keys</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('API keys')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200 gap-1"
                  >
                    <Key className="h-3 w-3 text-slate-500" />
                    <span>Manage Keys</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Webhook className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Webhooks</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Webhook events')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200 gap-1"
                  >
                    <Settings className="h-3 w-3 text-slate-500" />
                    <span>Configure</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Code className="h-3.5 w-3.5 text-indigo-500" />
                    <span>API Usage & Rate Limits</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Rate limits')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200 gap-1"
                  >
                    <Code className="h-3 w-3 text-slate-500" />
                    <span>View Limits</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    <span>API Documentation</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://api.pegatto.com/docs', '_blank')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200 gap-1"
                  >
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                    <span>Open Docs</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 6: Extension & Add-ons */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Puzzle className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Extension & Add-ons</h3>
                  <p className="text-[11px] text-slate-500">Manage marketplace extensions and third-party add-ons</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Puzzle className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Enable Add-on Marketplace</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, addonMarketplace: !advancedSettings.addonMarketplace })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.addonMarketplace ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Add-on Installation & Activation</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Managing add-on installations')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200"
                  >
                    <span>Manage</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Shield className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Extension Permissions</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Extension permissions')}
                    className="h-7 text-xs px-2.5 bg-white border-slate-200 gap-1"
                  >
                    <Settings className="h-3 w-3 text-slate-500" />
                    <span>Configure</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <RefreshCw className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Auto Update (Add-ons)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, autoUpdateAddons: !advancedSettings.autoUpdateAddons })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.autoUpdateAddons ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 7: Localization & Preferences */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Localization & Preferences</h3>
                  <p className="text-[11px] text-slate-500">Language, region and format settings</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Default Language</span>
                  <select
                    value={advancedSettings.defaultLanguage}
                    onChange={(e) => setAdvancedSettings({ ...advancedSettings, defaultLanguage: e.target.value })}
                    className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden font-medium text-xs min-w-[130px]"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Date Format</span>
                  <select
                    value={advancedSettings.dateFormat}
                    onChange={(e) => setAdvancedSettings({ ...advancedSettings, dateFormat: e.target.value })}
                    className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden font-medium text-xs min-w-[130px]"
                  >
                    <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Time Zone</span>
                  <select
                    value={advancedSettings.timeZone}
                    onChange={(e) => setAdvancedSettings({ ...advancedSettings, timeZone: e.target.value })}
                    className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden font-medium text-xs min-w-[130px]"
                  >
                    <option value="(GMT+05:30) India">(GMT+05:30) India</option>
                    <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                    <option value="(GMT-05:00) USA EST">(GMT-05:00) USA EST</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Currency</span>
                  <select
                    value={advancedSettings.currency}
                    onChange={(e) => setAdvancedSettings({ ...advancedSettings, currency: e.target.value })}
                    className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden font-medium text-xs min-w-[130px]"
                  >
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 8: Compliance & Governance */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <FileCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Compliance & Compliance</h3>
                  <p className="text-[11px] text-slate-500">Regulatory, privacy and audit controls</p>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-1">
                {[
                  { key: 'gdprCompliance', label: 'GDPR / DPDP Compliance Controls' },
                  { key: 'auditTrailLogs', label: 'Audit Trail & Activity Logs' },
                  { key: 'dataEncryption', label: 'Data Encryption (At Rest & In Transit)' },
                  { key: 'consentManagement', label: 'Consent Management (Privacy)' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={(advancedSettings as any)[item.key]}
                      onChange={() =>
                        setAdvancedSettings({
                          ...advancedSettings,
                          [item.key]: !(advancedSettings as any)[item.key],
                        })
                      }
                      className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
                    />
                    <span className="text-slate-800 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Card 9: Feature Management */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-[#1574fe] rounded-lg">
                  <Flag className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Feature Management</h3>
                  <p className="text-[11px] text-slate-500">Control feature rollout and experimental features</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Feature Flags (Enable/Disable)</span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, featureFlags: !advancedSettings.featureFlags })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.featureFlags ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Beta / Early Access Features</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdvancedSettings({ ...advancedSettings, betaEarlyAccess: !advancedSettings.betaEarlyAccess })}
                      className={cn(
                        'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                        advancedSettings.betaEarlyAccess ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Managing beta features')}
                      className="h-6.5 text-[11px] px-2 bg-white border-slate-200 gap-1"
                    >
                      <Settings className="h-3 w-3 text-slate-500" />
                      <span>Manage Features</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-700">Tenant-wise Feature Override</span>
                  <button
                    type="button"
                    onClick={() => setAdvancedSettings({ ...advancedSettings, tenantFeatureOverride: !advancedSettings.tenantFeatureOverride })}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      advancedSettings.tenantFeatureOverride ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
