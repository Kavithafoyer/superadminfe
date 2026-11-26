export interface CustomerRecord {
  id: string;
  name: string;
  customerId: string;
  industry: string;
  industryIcon: 'education' | 'it' | 'retail' | 'real-estate' | 'people';
  product: string;
  plan: string;
  startDate: string;
  nextRenewal: string;
  status: 'Active' | 'Expiring' | 'Overdue';
  arr: string;
  arrValue: number;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  customerSince: string;
  users: number;
  activeUsers: number;
  students: number;
  studentLogins: number;
  keyModules: number;
  totalModules: number;
  tenantsCount: number;
  healthScore: number;
  healthStatus: string;
  subscribedProducts: Array<{
    name: string;
    edition: string;
    status: string;
    icon: string;
  }>;
  addonsList: string[];
  accountOwner?: string;
  slaTier?: string;
  notes?: string;
}

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Bright Future School',
    customerId: 'CUST-EDU-0001',
    industry: 'Education',
    industryIcon: 'education',
    product: 'Education',
    plan: 'Professional',
    startDate: '01 Mar 2026',
    nextRenewal: '01 Mar 2027',
    status: 'Active',
    arr: '12,00,000',
    arrValue: 1200000,
    location: 'Chennai, India',
    contactPerson: 'Mr. Ramesh Kumar – Correspondent',
    phone: '+91 98400 12345',
    email: 'ramesh@bfsschool.edu.in',
    customerSince: '01 Mar 2024',
    users: 150,
    activeUsers: 142,
    students: 2800,
    studentLogins: 2436,
    keyModules: 8,
    totalModules: 10,
    tenantsCount: 1,
    healthScore: 92,
    healthStatus: 'Healthy',
    subscribedProducts: [
      { name: 'Pegatto Education', edition: 'Professional', status: 'Active', icon: 'graduation' },
      { name: 'Pegatto People (HRMS)', edition: 'Standard', status: 'Active', icon: 'users' },
    ],
    addonsList: ['AI Lead Scoring', 'WhatsApp CRM', 'Analytics'],
  },
  {
    id: 'cust-2',
    name: 'NextGen IT Solutions',
    customerId: 'CUST-IT-0002',
    industry: 'IT Services',
    industryIcon: 'it',
    product: 'IT',
    plan: 'Professional',
    startDate: '15 Feb 2026',
    nextRenewal: '15 Feb 2027',
    status: 'Active',
    arr: '18,00,000',
    arrValue: 1800000,
    location: 'Bangalore, India',
    contactPerson: 'Ms. Anita Sharma – VP Operations',
    phone: '+91 98221 44556',
    email: 'anita@nextgenit.io',
    customerSince: '15 Jan 2024',
    users: 220,
    activeUsers: 205,
    students: 0,
    studentLogins: 0,
    keyModules: 9,
    totalModules: 10,
    tenantsCount: 3,
    healthScore: 95,
    healthStatus: 'Healthy',
    subscribedProducts: [
      { name: 'Pegatto IT', edition: 'Professional', status: 'Active', icon: 'laptop' },
    ],
    addonsList: ['API Gateway', 'SSO Extension', 'Cloud Backup'],
  },
  {
    id: 'cust-3',
    name: 'City Retail Mart',
    customerId: 'CUST-RET-0003',
    industry: 'Retail',
    industryIcon: 'retail',
    product: 'Retail',
    plan: 'Standard',
    startDate: '10 Jan 2026',
    nextRenewal: '10 Jan 2027',
    status: 'Active',
    arr: '6,00,000',
    arrValue: 600000,
    location: 'Mumbai, India',
    contactPerson: 'Mr. Rajesh Gupta – Managing Partner',
    phone: '+91 97112 88990',
    email: 'rajesh@cityretail.in',
    customerSince: '10 Jan 2025',
    users: 60,
    activeUsers: 54,
    students: 0,
    studentLogins: 0,
    keyModules: 6,
    totalModules: 10,
    tenantsCount: 2,
    healthScore: 88,
    healthStatus: 'Healthy',
    subscribedProducts: [
      { name: 'Pegatto Retail', edition: 'Standard', status: 'Active', icon: 'cart' },
    ],
    addonsList: ['WhatsApp POS Integration', 'Inventory Sync'],
  },
  {
    id: 'cust-4',
    name: 'Shree Properties',
    customerId: 'CUST-RE-0004',
    industry: 'Real Estate',
    industryIcon: 'real-estate',
    product: 'Real Estate',
    plan: 'Standard',
    startDate: '05 Jan 2026',
    nextRenewal: '05 Jan 2027',
    status: 'Expiring',
    arr: '8,40,000',
    arrValue: 840000,
    location: 'Hyderabad, India',
    contactPerson: 'Mr. Vikram Reddy – Director',
    phone: '+91 99440 33221',
    email: 'vikram@shreeproperties.com',
    customerSince: '05 Jan 2025',
    users: 85,
    activeUsers: 70,
    students: 0,
    studentLogins: 0,
    keyModules: 7,
    totalModules: 10,
    tenantsCount: 1,
    healthScore: 74,
    healthStatus: 'Attention Needed',
    subscribedProducts: [
      { name: 'Pegatto Real Estate', edition: 'Standard', status: 'Active', icon: 'building' },
    ],
    addonsList: ['Lead Scoring', 'Virtual Tour Addon'],
  },
  {
    id: 'cust-5',
    name: 'PeopleFirst Services',
    customerId: 'CUST-HR-0005',
    industry: 'People (HRMS)',
    industryIcon: 'people',
    product: 'People',
    plan: 'Standard',
    startDate: '20 Dec 2025',
    nextRenewal: '20 Dec 2026',
    status: 'Active',
    arr: '9,00,000',
    arrValue: 900000,
    location: 'Pune, India',
    contactPerson: 'Ms. Sunita Patil – Head HR',
    phone: '+91 98555 12345',
    email: 'sunita@peoplefirst.org',
    customerSince: '20 Dec 2024',
    users: 110,
    activeUsers: 98,
    students: 0,
    studentLogins: 0,
    keyModules: 7,
    totalModules: 10,
    tenantsCount: 1,
    healthScore: 91,
    healthStatus: 'Healthy',
    subscribedProducts: [
      { name: 'Pegatto People (HRMS)', edition: 'Standard', status: 'Active', icon: 'users' },
    ],
    addonsList: ['Payroll Automation', 'Biometric Sync'],
  },
];
