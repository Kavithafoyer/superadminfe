import { ProductMasterRecord, StatusHistoryEntry, AuditHistoryEntry } from '@/service/api/superAdminService';

export interface EditionRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Draft';
  displayOrder: number;
  capabilities: Record<string, boolean>;
}

export interface CapabilityDefinition {
  id: string;
  name: string;
  category: string;
  iconType: 'users' | 'book' | 'card' | 'calendar' | 'award' | 'portal' | 'analytics' | 'building';
  description: string;
}

export interface ProductPricingPlan {
  id: string;
  name: string;
  editionCode: string;
  monthlyPrice: number;
  annualPrice: number;
  billingPeriod: 'monthly' | 'annually';
  features: string[];
  isPopular?: boolean;
}

export const EDUCATION_CAPABILITIES: CapabilityDefinition[] = [
  {
    id: 'cap-1',
    name: 'Lead & Admission Management',
    category: 'Admissions',
    iconType: 'users',
    description: 'Enquiry tracking, digital application forms, workflow automation and applicant scoring',
  },
  {
    id: 'cap-2',
    name: 'Student & Academic Management',
    category: 'Academics',
    iconType: 'book',
    description: 'Curriculum configuration, course registration, grading systems, and syllabus progress tracking',
  },
  {
    id: 'cap-3',
    name: 'Fees & Payments',
    category: 'Finance',
    iconType: 'card',
    description: 'Fee collection gateways, installment scheduling, automated receipting, and fine rules',
  },
  {
    id: 'cap-4',
    name: 'Attendance & Timetable',
    category: 'Operations',
    iconType: 'calendar',
    description: 'Biometric time clocks, classroom timetable generator, substitute teacher allocation',
  },
  {
    id: 'cap-5',
    name: 'Assessment & Progress Card',
    category: 'Academics',
    iconType: 'award',
    description: 'Term exam management, automated report card creation, GPA calculation, and skill rubrics',
  },
  {
    id: 'cap-6',
    name: 'Parent & Student Portals',
    category: 'Communication',
    iconType: 'portal',
    description: 'Mobile-responsive apps for homework updates, circulars, leave applications, and fees',
  },
  {
    id: 'cap-7',
    name: 'Analytics & Reports',
    category: 'Intelligence',
    iconType: 'analytics',
    description: 'Executive dashboards, student retention KPIs, teacher load analytics, and compliance audits',
  },
  {
    id: 'cap-8',
    name: 'Multi-Campus / Group Management',
    category: 'Enterprise',
    iconType: 'building',
    description: 'Centralized governance across distributed school branches, unified finance and shared curriculum',
  },
];

export interface InitialProductConfig {
  id: string;
  product_name: string;
  product_code: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Draft' | 'Under Review' | 'Archived';
  short_description: string;
  description: string;
  current_version: string;
  release_date: string;
  lifecycle_stage: string;
  logo_file: string;
  logo_dimensions: string;
  icon_file: string;
  icon_dimensions: string;
  icon_type: 'education' | 'it' | 'people' | 'retail' | 'real_estate' | 'crm' | 'core';
  editions_count: number;
  editions: string[];
  editions_details: EditionRecord[];
}

export const INITIAL_PRODUCTS: InitialProductConfig[] = [
  {
    id: 'prd-edu',
    product_name: 'Pegatto Education',
    product_code: 'PEG-EDU',
    category: 'Education',
    status: 'Active',
    short_description: 'AI-powered education management platform to streamline admissions, academics, fees, attendance, assessments and parent engagement.',
    description: 'A comprehensive, cloud-based solution for schools and educational institutions covering the entire student lifecycle from enquiry to alumni, with AI insights and analytics.',
    current_version: 'v2.1.0',
    release_date: '10 Nov 2026',
    lifecycle_stage: 'General Availability',
    logo_file: 'pegatto-education.svg',
    logo_dimensions: '(120 x 120)',
    icon_file: 'edu-icon.svg',
    icon_dimensions: '(32 x 32)',
    icon_type: 'education',
    editions_count: 3,
    editions: ['Core (Free)', 'Standard', 'Enterprise'],
    editions_details: [
      {
        id: 'ed-edu-core',
        name: 'Core (Free)',
        code: 'EDU-CORE',
        description: 'Essential features for basic education operations',
        status: 'Active',
        displayOrder: 1,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': false,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': false,
          'Parent & Student Portals': false,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-edu-std',
        name: 'Standard',
        code: 'EDU-STD',
        description: 'Complete admission and school management',
        status: 'Active',
        displayOrder: 2,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-edu-ent',
        name: 'Enterprise',
        code: 'EDU-ENT',
        description: 'Advanced features for multi-campus and large groups',
        status: 'Active',
        displayOrder: 3,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': true,
        },
      },
    ],
  },
  {
    id: 'prd-it',
    product_name: 'Pegatto IT',
    product_code: 'PEG-IT',
    category: 'IT / Services',
    status: 'Active',
    short_description: 'Enterprise IT service desk, asset tracking, incident management, and cloud infrastructure monitoring.',
    description: 'Complete IT operations suite providing end-to-end ticketing, SLA governance, change control, CMDB asset management, and proactive alerting.',
    current_version: 'v3.0.4',
    release_date: '15 Oct 2026',
    lifecycle_stage: 'General Availability',
    logo_file: 'pegatto-it.svg',
    logo_dimensions: '(120 x 120)',
    icon_file: 'it-icon.svg',
    icon_dimensions: '(32 x 32)',
    icon_type: 'it',
    editions_count: 3,
    editions: ['Core (Free)', 'Standard', 'Enterprise'],
    editions_details: [
      {
        id: 'ed-it-core',
        name: 'Core (Free)',
        code: 'IT-CORE',
        description: 'Essential features for basic helpdesk and IT ticketing',
        status: 'Active',
        displayOrder: 1,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': false,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': false,
          'Parent & Student Portals': false,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-it-std',
        name: 'Standard',
        code: 'IT-STD',
        description: 'Full ITIL service desk, asset CMDB and SLA automation',
        status: 'Active',
        displayOrder: 2,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-it-ent',
        name: 'Enterprise',
        code: 'IT-ENT',
        description: 'Multi-tenant cloud infrastructure and AI anomaly detection',
        status: 'Active',
        displayOrder: 3,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': true,
        },
      },
    ],
  },
  {
    id: 'prd-hr',
    product_name: 'Pegatto People',
    product_code: 'PEG-HR',
    category: 'HRMS',
    status: 'Active',
    short_description: 'All-in-one human resource platform for onboarding, payroll processing, leave management, and employee appraisal.',
    description: 'Modern workforce management system designed for global teams, supporting payroll compliance, talent acquisition, attendance time-clocks, and performance reviews.',
    current_version: 'v2.4.1',
    release_date: '01 Sep 2026',
    lifecycle_stage: 'General Availability',
    logo_file: 'pegatto-people.svg',
    logo_dimensions: '(120 x 120)',
    icon_file: 'people-icon.svg',
    icon_dimensions: '(32 x 32)',
    icon_type: 'people',
    editions_count: 3,
    editions: ['Core (Free)', 'Standard', 'Enterprise'],
    editions_details: [
      {
        id: 'ed-hr-core',
        name: 'Core (Free)',
        code: 'HR-CORE',
        description: 'Essential employee directory and self-service portal',
        status: 'Active',
        displayOrder: 1,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': false,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': false,
          'Parent & Student Portals': false,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-hr-std',
        name: 'Standard',
        code: 'HR-STD',
        description: 'Payroll processing, leaves, time tracking, and compliance',
        status: 'Active',
        displayOrder: 2,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-hr-ent',
        name: 'Enterprise',
        code: 'HR-ENT',
        description: 'Global multi-entity payroll, ATS recruitment, and appraisal',
        status: 'Active',
        displayOrder: 3,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': true,
        },
      },
    ],
  },
  {
    id: 'prd-ret',
    product_name: 'Pegatto Retail',
    product_code: 'PEG-RET',
    category: 'Retail',
    status: 'Active',
    short_description: 'Unified omnichannel retail POS, inventory synchronization, barcode scanning, and loyalty rewards.',
    description: 'Retail management system with multi-store inventory distribution, offline POS capabilities, customer retention programs, and supplier reconciliation.',
    current_version: 'v1.9.0',
    release_date: '20 Aug 2026',
    lifecycle_stage: 'General Availability',
    logo_file: 'pegatto-retail.svg',
    logo_dimensions: '(120 x 120)',
    icon_file: 'retail-icon.svg',
    icon_dimensions: '(32 x 32)',
    icon_type: 'retail',
    editions_count: 3,
    editions: ['Core (Free)', 'Standard', 'Enterprise'],
    editions_details: [
      {
        id: 'ed-ret-core',
        name: 'Core (Free)',
        code: 'RET-CORE',
        description: 'Single checkout counter and inventory lookup',
        status: 'Active',
        displayOrder: 1,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': false,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': false,
          'Parent & Student Portals': false,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-ret-std',
        name: 'Standard',
        code: 'RET-STD',
        description: 'Multi-store inventory, barcode printing, and loyalty points',
        status: 'Active',
        displayOrder: 2,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-ret-ent',
        name: 'Enterprise',
        code: 'RET-ENT',
        description: 'Omnichannel fulfillment, franchise billing, and warehouse EDI',
        status: 'Active',
        displayOrder: 3,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': true,
        },
      },
    ],
  },
  {
    id: 'prd-re',
    product_name: 'Pegatto Real Estate',
    product_code: 'PEG-RE',
    category: 'Real Estate',
    status: 'Active',
    short_description: 'Property management, unit leasing, tenant billing, maintenance requests, and contract automation.',
    description: 'End-to-end real estate solution covering property listings, tenant screening, lease agreements, recurring rent invoicing, and building maintenance dispatch.',
    current_version: 'v1.5.2',
    release_date: '05 Jul 2026',
    lifecycle_stage: 'General Availability',
    logo_file: 'pegatto-re.svg',
    logo_dimensions: '(120 x 120)',
    icon_file: 're-icon.svg',
    icon_dimensions: '(32 x 32)',
    icon_type: 'real_estate',
    editions_count: 3,
    editions: ['Core (Free)', 'Standard', 'Enterprise'],
    editions_details: [
      {
        id: 'ed-re-core',
        name: 'Core (Free)',
        code: 'RE-CORE',
        description: 'Property registry and tenant contact directory',
        status: 'Active',
        displayOrder: 1,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': false,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': false,
          'Parent & Student Portals': false,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-re-std',
        name: 'Standard',
        code: 'RE-STD',
        description: 'Automated rent invoicing, lease renewals, and ticket dispatch',
        status: 'Active',
        displayOrder: 2,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-re-ent',
        name: 'Enterprise',
        code: 'RE-ENT',
        description: 'Commercial asset portfolio, CAM accounting, and investor reports',
        status: 'Active',
        displayOrder: 3,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': true,
        },
      },
    ],
  },
  {
    id: 'prd-crm',
    product_name: 'Pegatto CRM',
    product_code: 'PEG-CRM',
    category: 'CRM (Generic)',
    status: 'Active',
    short_description: 'Intelligent customer relationship management, sales pipelines, omnichannel lead captures, and revenue forecasting.',
    description: 'High-performance CRM with email sequence automation, deals board, contact intelligence, quotes, and predictive win-rate scoring.',
    current_version: 'v4.2.0',
    release_date: '18 Jun 2026',
    lifecycle_stage: 'General Availability',
    logo_file: 'pegatto-crm.svg',
    logo_dimensions: '(120 x 120)',
    icon_file: 'crm-icon.svg',
    icon_dimensions: '(32 x 32)',
    icon_type: 'crm',
    editions_count: 2,
    editions: ['Standard', 'Enterprise'],
    editions_details: [
      {
        id: 'ed-crm-std',
        name: 'Standard',
        code: 'CRM-STD',
        description: 'Deals pipeline, contact records, and email synchronization',
        status: 'Active',
        displayOrder: 1,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
      {
        id: 'ed-crm-ent',
        name: 'Enterprise',
        code: 'CRM-ENT',
        description: 'Automated playbooks, AI deal scoring, and quota analytics',
        status: 'Active',
        displayOrder: 2,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': true,
          'Parent & Student Portals': true,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': true,
        },
      },
    ],
  },
  {
    id: 'prd-core',
    product_name: 'Pegatto Core (Free Platform)',
    product_code: 'PEG-CORE',
    category: 'Platform',
    status: 'Active',
    short_description: 'Base platform infrastructure providing unified user authentication, role-based access, notifications, and telemetry.',
    description: 'Underlying Pegatto ecosystem platform serving as the backbone for tenant isolation, single sign-on, billing webhooks, API gateway, and audit trail logging.',
    current_version: 'v1.0.0',
    release_date: '01 Jan 2026',
    lifecycle_stage: 'General Availability',
    logo_file: 'pegatto-core.svg',
    logo_dimensions: '(120 x 120)',
    icon_file: 'core-icon.svg',
    icon_dimensions: '(32 x 32)',
    icon_type: 'core',
    editions_count: 1,
    editions: ['Core (Free)'],
    editions_details: [
      {
        id: 'ed-core-free',
        name: 'Core (Free)',
        code: 'PLAT-CORE',
        description: 'Foundational SSO, role security, audit log, and tenant sandbox',
        status: 'Active',
        displayOrder: 1,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': false,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': false,
          'Parent & Student Portals': false,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      },
    ],
  },
];

export function toProductMasterRecord(config: InitialProductConfig, index: number): ProductMasterRecord {
  const nowIso = new Date().toISOString();
  return {
    id: config.id,
    product_code: config.product_code,
    product_name: config.product_name,
    category: config.category,
    status: config.status,
    short_description: config.short_description,
    description: config.description,
    current_version: config.current_version,
    release_date: config.release_date,
    lifecycle_stage: config.lifecycle_stage,
    logo_file: config.logo_file,
    logo_dimensions: config.logo_dimensions,
    icon_file: config.icon_file,
    icon_dimensions: config.icon_dimensions,
    icon_type: config.icon_type,
    editions_count: config.editions_count,
    editions: config.editions,
    editions_details: config.editions_details,
    display_order: index + 1,
    modules_count: 8,
    modules: [
      'Lead & Admission Management',
      'Student & Academic Management',
      'Fees & Payments',
      'Attendance & Timetable',
      'Assessment & Progress Card',
      'Parent & Student Portals',
      'Analytics & Reports',
      'Multi-Campus / Group Management',
    ],
    region: 'Global',
    approval_status: 'Approved',
    approval_notes: 'Production ready for catalog publication',
    created_at: nowIso,
    updated_at: nowIso,
    status_history: [
      {
        id: `sh-${config.id}-1`,
        fromStatus: 'Draft',
        toStatus: 'Active',
        changedBy: 'SuperAdmin',
        userRole: 'SuperAdmin',
        timestamp: nowIso,
        reason: 'Master production release',
      },
    ],
    audit_history: [
      {
        id: `ah-${config.id}-1`,
        action: 'CREATE',
        performedBy: 'SuperAdmin',
        userRole: 'SuperAdmin',
        timestamp: nowIso,
        details: `Created master catalog entry for ${config.product_name}`,
      },
    ],
  };
}

export const SEED_PRODUCT_MASTERS: ProductMasterRecord[] = INITIAL_PRODUCTS.map((p, idx) =>
  toProductMasterRecord(p, idx)
);
