import { ProductMasterRecord, StatusHistoryEntry, AuditHistoryEntry } from '@/service/api/superAdminService';

export type UserRole = 'SuperAdmin' | 'Product Manager' | 'Operations Manager' | 'Auditor';

export interface RolePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDeactivate: boolean;
  canDelete: boolean;
  canExport: boolean;
  canApprove: boolean;
  canSubmitApproval: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  SuperAdmin: {
    canCreate: true,
    canEdit: true,
    canDeactivate: true,
    canDelete: true,
    canExport: true,
    canApprove: true,
    canSubmitApproval: true,
  },
  'Product Manager': {
    canCreate: true,
    canEdit: true,
    canDeactivate: false,
    canDelete: false,
    canExport: true,
    canApprove: false,
    canSubmitApproval: true,
  },
  'Operations Manager': {
    canCreate: false,
    canEdit: false,
    canDeactivate: true,
    canDelete: false,
    canExport: true,
    canApprove: false,
    canSubmitApproval: false,
  },
  Auditor: {
    canCreate: false,
    canEdit: false,
    canDeactivate: false,
    canDelete: false,
    canExport: true,
    canApprove: false,
    canSubmitApproval: false,
  },
};

export const PRODUCT_CATEGORIES = [
  'ERP',
  'CRM',
  'HRMS',
  'Analytics',
  'Billing & Finance',
  'Operations',
  'Cloud Infrastructure',
  'Collaboration',
  'Security & Compliance',
  'Supply Chain',
] as const;

export const PRODUCT_STATUSES = [
  'Active',
  'Inactive',
  'Draft',
  'Under Review',
  'Archived',
] as const;

export const PRODUCT_REGIONS = [
  'Global',
  'North America',
  'EMEA',
  'APAC',
  'LATAM',
] as const;

export const DEFAULT_EDITION_OPTIONS = [
  'Standard',
  'Professional',
  'Enterprise',
  'Ultimate Global',
  'Essential',
  'Community',
  'Lite',
  'Pro',
] as const;

export interface ModuleCategoryGroup {
  category: string;
  colorName: string;
  badgeClass: string;
  activeClass: string;
  dotColor: string;
  modules: string[];
}

export const MODULE_GROUPS: ModuleCategoryGroup[] = [
  {
    category: 'Finance & Billing',
    colorName: 'Emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20',
    dotColor: 'bg-emerald-500',
    modules: [
      'Ledger Accounting',
      'Tax Engine',
      'Recurring Invoicing',
      'Gateway Connect',
      'Dispute Management',
    ],
  },
  {
    category: 'CRM & Sales Automation',
    colorName: 'Blue',
    badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    activeClass: 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20',
    dotColor: 'bg-blue-500',
    modules: [
      'Lead Tracking',
      'Deal Pipeline',
      'Contact Center',
      'Campaign Engine',
      'Quotation Generator',
      'Customer Health Score',
    ],
  },
  {
    category: 'Supply Chain & ERP',
    colorName: 'Amber',
    badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    activeClass: 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-500/20',
    dotColor: 'bg-amber-500',
    modules: [
      'Inventory Control',
      'Procurement',
      'Asset Management',
      'Supply Chain',
      'Order Fulfillment',
    ],
  },
  {
    category: 'HRMS & Workforce',
    colorName: 'Purple',
    badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    activeClass: 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20',
    dotColor: 'bg-purple-500',
    modules: [
      'Employee Directory',
      'Attendance & Biometrics',
      'Payroll & Compliance',
      'Performance Reviews',
      'Recruitment ATS',
    ],
  },
  {
    category: 'Analytics & BI Cloud',
    colorName: 'Cyan',
    badgeClass: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    activeClass: 'bg-cyan-600 text-white border-cyan-600 shadow-sm shadow-cyan-500/20',
    dotColor: 'bg-cyan-500',
    modules: [
      'Executive Dashboard',
      'Custom Query Builder',
      'Predictive Forecasting',
      'Scheduled Reports',
      'Data Connectors',
      'Audit Reports',
    ],
  },
  {
    category: 'Operations & Execution',
    colorName: 'Rose',
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    activeClass: 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-500/20',
    dotColor: 'bg-rose-500',
    modules: [
      'Gantt Planner',
      'Kanban Sprints',
      'Resource Matrix',
      'Time Tracking',
    ],
  },
];

export const AVAILABLE_MODULES = MODULE_GROUPS.flatMap((g) => g.modules);

export function getModuleMeta(moduleName: string) {
  for (const group of MODULE_GROUPS) {
    if (group.modules.includes(moduleName)) {
      return group;
    }
  }
  return {
    category: 'General',
    colorName: 'Slate',
    badgeClass: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30',
    activeClass: 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-700',
    dotColor: 'bg-slate-500',
    modules: [moduleName],
  };
}
