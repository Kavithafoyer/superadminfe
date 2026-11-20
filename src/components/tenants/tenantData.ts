export interface PendingTenant {
  id: string;
  name: string;
  product: string;
  productIcon: 'education' | 'it' | 'retail' | 'real-estate' | 'people';
  plan: string;
  requestedOn: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  contactPerson: string;
  email: string;
  mobile: string;
  expectedUsers: number;
}

export interface TenantRecord {
  id: string;
  name: string;
  product: string;
  productIcon: 'education' | 'it' | 'retail' | 'real-estate' | 'people';
  plan: string;
  status: 'Active' | 'Onboarding' | 'Trial' | 'Suspended' | 'Terminated';
  since: string;
  nextRenewal: string;
  lifecycleStage: number; // 1 to 4 dots
}

export interface ExportHistoryRecord {
  id: string;
  dateTime: string;
  tenant: string;
  action: 'Export' | 'Deletion';
  dataScope: string;
  initiatedBy: string;
  status: 'Completed' | 'Failed';
  fileSize?: string;
}

export interface SuspensionTenantRecord {
  id: string;
  tenantId: string;
  name: string;
  product: string;
  productIcon: 'education' | 'it' | 'retail' | 'real-estate' | 'people';
  plan: string;
  status: 'Active' | 'Suspended';
  suspendedOn: string;
  registeredDate: string;
  activatedDate: string;
  suspensionReason?: string;
}

export interface LimitQuotaRecord {
  resource: string;
  iconType: 'users' | 'students' | 'storage' | 'api' | 'addons' | 'modules';
  planLimit: string;
  currentUsage: string;
  percentUsed: number;
  status: 'Normal' | 'Near Limit' | 'Exceeded';
}

export interface TenantRetentionSetting {
  id: string;
  tenantName: string;
  dataRetention: string;
  postRetentionAction: 'Permanent Deletion' | 'Archive & Delete';
  status: 'Active';
}

export interface PolicyVersionRecord {
  version: string;
  description: string;
  updatedBy: string;
  updatedOn: string;
  status: 'Current' | 'Published' | 'Archived';
}

export const INITIAL_PENDING_TENANTS: PendingTenant[] = [
  {
    id: 'pt-1',
    name: 'Bright Future School',
    product: 'Education',
    productIcon: 'education',
    plan: 'Standard',
    requestedOn: '18 Nov 2026, 11:20 AM',
    status: 'Pending',
    contactPerson: 'Mr. Ramesh Kumar',
    email: 'ramesh@bfschool.edu.in',
    mobile: '+91 98400 12345',
    expectedUsers: 150,
  },
  {
    id: 'pt-2',
    name: 'NextGen IT Solutions',
    product: 'IT',
    productIcon: 'it',
    plan: 'Standard',
    requestedOn: '18 Nov 2026, 10:05 AM',
    status: 'Pending',
    contactPerson: 'Ms. Anita Sharma',
    email: 'anita@nextgenit.io',
    mobile: '+91 98221 44556',
    expectedUsers: 200,
  },
  {
    id: 'pt-3',
    name: 'City Retail Mart',
    product: 'Retail',
    productIcon: 'retail',
    plan: 'Professional',
    requestedOn: '17 Nov 2026, 06:42 PM',
    status: 'Pending',
    contactPerson: 'Mr. Rajesh Gupta',
    email: 'rajesh@cityretail.in',
    mobile: '+91 97112 88990',
    expectedUsers: 80,
  },
  {
    id: 'pt-4',
    name: 'Shree Properties',
    product: 'Real State',
    productIcon: 'real-estate',
    plan: 'Standard',
    requestedOn: '17 Nov 2026, 02:18 PM',
    status: 'Pending',
    contactPerson: 'Mr. Vikram Reddy',
    email: 'vikram@shreeproperties.com',
    mobile: '+91 99440 33221',
    expectedUsers: 90,
  },
  {
    id: 'pt-5',
    name: 'PeopleFirst Services',
    product: 'People (HRMS)',
    productIcon: 'people',
    plan: 'Standard',
    requestedOn: '17 Nov 2026, 11:36 AM',
    status: 'Pending',
    contactPerson: 'Ms. Sunita Patil',
    email: 'sunita@peoplefirst.org',
    mobile: '+91 98555 12345',
    expectedUsers: 120,
  },
];

export const INITIAL_TENANTS_LIFECYCLE: TenantRecord[] = [
  {
    id: 't-1',
    name: 'Bright Future School',
    product: 'Education',
    productIcon: 'education',
    plan: 'Professional',
    status: 'Active',
    since: '01 Mar 2024',
    nextRenewal: '01 Mar 2027',
    lifecycleStage: 4,
  },
  {
    id: 't-2',
    name: 'NextGen IT Solutions',
    product: 'IT',
    productIcon: 'it',
    plan: 'Standard',
    status: 'Onboarding',
    since: '15 Feb 2026',
    nextRenewal: '—',
    lifecycleStage: 2,
  },
  {
    id: 't-3',
    name: 'City Retail Mart',
    product: 'Retail',
    productIcon: 'retail',
    plan: 'Standard',
    status: 'Trial',
    since: '10 Jan 2026',
    nextRenewal: '10 Apr 2026',
    lifecycleStage: 2,
  },
  {
    id: 't-4',
    name: 'Shree Properties',
    product: 'Real Estate',
    productIcon: 'real-estate',
    plan: 'Professional',
    status: 'Suspended',
    since: '05 Jan 2026',
    nextRenewal: '—',
    lifecycleStage: 2,
  },
  {
    id: 't-5',
    name: 'PeopleFirst Services',
    product: 'People',
    productIcon: 'people',
    plan: 'Standard',
    status: 'Terminated',
    since: '20 Dec 2025',
    nextRenewal: '—',
    lifecycleStage: 1,
  },
];

export const INITIAL_EXPORT_HISTORY: ExportHistoryRecord[] = [
  {
    id: 'exp-1',
    dateTime: '15 Nov 2026, 11:24 AM',
    tenant: 'Bright Future School',
    action: 'Export',
    dataScope: 'All Data (1.9 GB)',
    initiatedBy: 'N. R. Patnaik',
    status: 'Completed',
  },
  {
    id: 'exp-2',
    dateTime: '15 Nov 2026, 11:02 AM',
    tenant: 'NextGen IT Solutions',
    action: 'Deletion',
    dataScope: 'All Tenant Data',
    initiatedBy: 'N. R. Patnaik',
    status: 'Completed',
  },
  {
    id: 'exp-3',
    dateTime: '10 Nov 2026, 04:37 PM',
    tenant: 'City Retail Mart',
    action: 'Export',
    dataScope: 'Business Data (650 MB)',
    initiatedBy: 'Admin User',
    status: 'Completed',
  },
  {
    id: 'exp-4',
    dateTime: '08 Nov 2026, 10:12 AM',
    tenant: 'Shree Properties',
    action: 'Deletion',
    dataScope: 'Users & Roles, Documents',
    initiatedBy: 'Admin User',
    status: 'Completed',
  },
  {
    id: 'exp-5',
    dateTime: '05 Nov 2026, 02:18 PM',
    tenant: 'PeopleFirst Services',
    action: 'Export',
    dataScope: 'All Data (2.4 GB)',
    initiatedBy: 'N. R. Patnaik',
    status: 'Failed',
  },
];

export const INITIAL_SUSPENSION_TENANTS: SuspensionTenantRecord[] = [
  {
    id: 'susp-1',
    tenantId: 'CUST-EDU-0001',
    name: 'Bright Future School',
    product: 'Education',
    productIcon: 'education',
    plan: 'Professional',
    status: 'Active',
    suspendedOn: '—',
    registeredDate: '01 Jan 2024',
    activatedDate: '01 Mar 2024',
  },
  {
    id: 'susp-2',
    tenantId: 'CUST-IT-0002',
    name: 'NextGen IT Solutions',
    product: 'IT',
    productIcon: 'it',
    plan: 'Standard',
    status: 'Suspended',
    suspendedOn: '15 Nov 2026',
    registeredDate: '10 Jan 2026',
    activatedDate: '12 Jan 2026',
    suspensionReason: 'Non-payment of subscription',
  },
  {
    id: 'susp-3',
    tenantId: 'CUST-RET-0003',
    name: 'City Retail Mart',
    product: 'Retail',
    productIcon: 'retail',
    plan: 'Standard',
    status: 'Active',
    suspendedOn: '—',
    registeredDate: '05 Jan 2026',
    activatedDate: '10 Jan 2026',
  },
  {
    id: 'susp-4',
    tenantId: 'CUST-RE-0004',
    name: 'Shree Properties',
    product: 'Real Estate',
    productIcon: 'real-estate',
    plan: 'Professional',
    status: 'Active',
    suspendedOn: '—',
    registeredDate: '02 Jan 2026',
    activatedDate: '05 Jan 2026',
  },
  {
    id: 'susp-5',
    tenantId: 'CUST-HR-0005',
    name: 'PeopleFirst Services',
    product: 'People',
    productIcon: 'people',
    plan: 'Standard',
    status: 'Suspended',
    suspendedOn: '05 Nov 2026',
    registeredDate: '15 Dec 2025',
    activatedDate: '20 Dec 2025',
    suspensionReason: 'Subscription overdue for more than 30 days',
  },
];

export const INITIAL_LIMITS_QUOTAS: LimitQuotaRecord[] = [
  {
    resource: 'Users',
    iconType: 'users',
    planLimit: '150',
    currentUsage: '142',
    percentUsed: 95,
    status: 'Near Limit',
  },
  {
    resource: 'Students',
    iconType: 'students',
    planLimit: '3,000',
    currentUsage: '2,436',
    percentUsed: 81,
    status: 'Normal',
  },
  {
    resource: 'Storage',
    iconType: 'storage',
    planLimit: '200 GB',
    currentUsage: '180 GB',
    percentUsed: 90,
    status: 'Near Limit',
  },
  {
    resource: 'API Calls (Monthly)',
    iconType: 'api',
    planLimit: '100,000',
    currentUsage: '48,500',
    percentUsed: 49,
    status: 'Normal',
  },
  {
    resource: 'Add-ons',
    iconType: 'addons',
    planLimit: '10',
    currentUsage: '6',
    percentUsed: 60,
    status: 'Normal',
  },
  {
    resource: 'Custom Modules',
    iconType: 'modules',
    planLimit: '20',
    currentUsage: '14',
    percentUsed: 70,
    status: 'Normal',
  },
];

export const INITIAL_TENANT_RETENTION_SETTINGS: TenantRetentionSetting[] = [
  {
    id: 'ret-1',
    tenantName: 'Bright Future School',
    dataRetention: '5 Years',
    postRetentionAction: 'Permanent Deletion',
    status: 'Active',
  },
  {
    id: 'ret-2',
    tenantName: 'NextGen IT Solutions',
    dataRetention: '7 Years',
    postRetentionAction: 'Archive & Delete',
    status: 'Active',
  },
  {
    id: 'ret-3',
    tenantName: 'City Retail Mart',
    dataRetention: '5 Years',
    postRetentionAction: 'Permanent Deletion',
    status: 'Active',
  },
  {
    id: 'ret-4',
    tenantName: 'Shree Properties',
    dataRetention: '3 Years',
    postRetentionAction: 'Permanent Deletion',
    status: 'Active',
  },
  {
    id: 'ret-5',
    tenantName: 'PeopleFirst Services',
    dataRetention: '5 Years',
    postRetentionAction: 'Archive & Delete',
    status: 'Active',
  },
];

export const INITIAL_POLICY_VERSIONS: PolicyVersionRecord[] = [
  {
    version: 'v2.1',
    description: 'Updated retention to 5 years and added GDPR/DPDP',
    updatedBy: 'N. R. Patnaik',
    updatedOn: '15 Nov 2026',
    status: 'Current',
  },
  {
    version: 'v2.0',
    description: 'Added audit log retention (7 years)',
    updatedBy: 'Admin',
    updatedOn: '10 Aug 2026',
    status: 'Published',
  },
  {
    version: 'v1.0',
    description: 'Initial retention policy setup',
    updatedBy: 'Admin',
    updatedOn: '01 Jan 2026',
    status: 'Archived',
  },
];
