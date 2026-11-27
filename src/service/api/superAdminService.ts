import { baseApi, getTenantName, normalizeApiUrl } from "../baseApi";
import { fetchFromApi } from "../apiClient";
import { downloadSuperAdminExportCsv } from "./exportCsvHelper";

// ----------------------------------------------------------------------
// DATA TYPES MATCHING superadminfe API
// ----------------------------------------------------------------------

export interface RevenueForecastTrendItem {
  month: string;
  mrr?: number;
  arr?: number;
}

export interface RevenueForecastData {
  current_mrr: number;
  current_arr: number;
  mrr_trend: Array<{ month: string; mrr: number }>;
  arr_trend: Array<{ month: string; arr: number }>;
}

export interface PaymentHighlightsData {
  total_invoiced: number;
  outstanding_amount: number;
  payment_success_rate: number;
  failed_payments: number;
  avg_payment_delay_days: number;
}

export interface TopPlansData {
  labels: string[];
  counts: number[];
}

export interface RenewalFunnelData {
  due_this_month: number;
  invoice_generated: number;
  payment_received: number;
  failed: number;
}

export interface RequestDistributionData {
  total_requests: number;
  invoice_generated_requests: number;
  pending_invoice_requests: number;
  instance_created: number;
  instance_pending: number;
  request_distribution: Array<{ module: string; count: number }>;
}

export interface PlanAdoptionData {
  total_active_subscriptions: number;
  trial_conversion_rate: number;
  plan_breakdown?: Array<{
    plan_name: string;
    count: number;
    percentage: number;
  }>;
}

export interface RenewalAnalyticsData {
  renewal_rate: number;
  upcoming_renewals_count: number;
  renewed_count: number;
}

export interface CancellationAnalyticsData {
  total_cancellations: number;
  churn_rate: number;
  reasons: Array<{ reason: string; count: number }>;
}

export interface SubscriptionAnalyticsData {
  active: number;
  trial: number;
  expired: number;
  renewal_rate: number;
  mrr?: number;
  arr?: number;
}

export interface SubscriptionInsightsData {
  churn_by_product: Array<{ product: string; total: number }>;
  trial_to_paid_conversion?: number;
  expiring_soon?: Array<{
    id: number;
    Subscription_Name: string;
    Customer_Name: string;
    end_date: string;
  }>;
  growth_rate?: number;
  arpa?: number;
}

export interface UsageAnalyticsData {
  dau_trend: Array<{ date: string; active_users: number }>;
  total_storage_gb?: number;
  api_calls_today?: number;
}

export interface InstanceAnalyticsData {
  growth: Array<{ period: string; total: number; active: number }>;
  total_instances: number;
  healthy_count: number;
  avg_cpu_percent: number;
  avg_memory_percent: number;
}

export interface CustomerKpiData {
  total_customers: number;
  active_customers: number;
  expiring_customers: number;
  overdue_customers: number;
  total_arr: number;
  formatted_arr: string;
  active_pct: number;
  expiring_pct: number;
  overdue_pct: number;
  status_distribution?: {
    total: number;
    active: { count: number; pct: number };
    expiring: { count: number; pct: number };
    overdue: { count: number; pct: number };
  };
  product_adoption: Array<{
    label: string;
    count: number;
    pct: number;
  }>;
}

export interface CustomerOverviewAnalyticsData {
  customer_id: string;
  customer_name: string;
  industry: string;
  kpis: {
    arr: number;
    arr_formatted: string;
    arr_display: string;
    licensed_seats: number;
    active_users: number;
    adoption_rate: number;
    next_renewal: string;
    days_until_renewal: number | null;
    renewal_status: string;
    payment_status: string;
    plan: string;
    product: string;
    tenants_count: number;
  };
  subscribed_products: Array<{
    name: string;
    edition: string;
    status: string;
  }>;
  addons: string[];
  usage_and_adoption: {
    active_users: {
      current: number;
      total: number;
      pct: number;
    };
    daily_active_logins: {
      current: number;
      total: number;
      pct: number;
    };
    key_modules_used: {
      current: number;
      total: number;
      pct: number;
    };
  };
  customer_health: {
    score: number;
    status: string;
    color: string;
    checklist: Array<{
      label: string;
      passed: boolean;
    }>;
  };
  usage_trend: {
    growth_label: string;
    monthly_data: Array<{
      month: string;
      active_users: number;
      target_users: number;
    }>;
    max_val: number;
  };
  subscription_summary: {
    plan: string;
    arr: number;
    arr_formatted: string;
    next_renewal: string;
    days_left: number | null;
    renewal_likelihood: string;
    total_invoices: number;
    total_invoiced_amt: number;
  };
}

export interface CustomerAuditHistoryRecord {
  id: number | string;
  Audit_Id?: string;
  Module_Name?: string;
  Table_Name?: string;
  Record_Id?: string;
  Action: "CREATE" | "UPDATE" | "DELETE" | string;
  Old_Data?: any;
  New_Data?: any;
  Description?: string;
  IP_Address?: string;
  User_Agent?: string;
  Created_Date: string;
  Created_By?: any;
  User_Id?: any;
  Action_Status?: string;
}

export interface DocumentMasterRecord {
  id: number | string;
  Document_Id?: string;
  Account_Id?: any;
  File?: string;
  FileName?: string;
  File_Type?: string;
  File_Size?: string;
  Description?: string;
  Created_By?: any;
  Created_Date?: string;
  Updated_By?: any;
  Updated_Date?: string;
  Is_Deleted?: boolean;
  [key: string]: any;
}

// ----------------------------------------------------------------------
// ACCOUNT & SALES ENTITY INTERFACES (Matching superadminfe specifications)
// ----------------------------------------------------------------------

export interface AccountRecord {
  id: string | number;
  Organization_Name: string;
  Contact_Name: string;
  Mail: string;
  Phone_Number: string;
  name?: string;
  company_name?: string;
  Land_Line?: string;
  Fax?: string;
  Industry?: string;
  Turn_Over?: string;
  Employees?: string | number;
  GST_No?: string;
  Payment_Terms?: string;
  Country?: string;
  Country_Code?: string;
  State?: string;
  City?: string;
  Location?: string;
  Address?: {
    Pincode?: string;
    AreaName?: string;
    StreetName?: string;
    BuildingDoorNo?: string;
  };
  Account_Owner?: string;
  Active_Flag?: boolean;
  Created_Date?: string;
  [key: string]: any;
}

export interface PlanRecord {
  id: string | number;
  name: string;
  code: string;
  Producttype?: string;
  product?: string;
  plantype?: string;
  price: number;
  monthly_price?: number;
  yearly_price?: number;
  currency?: string;
  country?: string;
  noofuser?: number;
  no_of_users?: number;
  max_users?: number;
  noofcontact?: number;
  storage?: number;
  storage_limit?: number;
  max_storage_gb?: number;
  trailperiod?: number;
  billing_cycle?: string;
  description?: string;
  plandetails?: string;
  isMonthly?: boolean;
  isYearly?: boolean;
  is_active?: boolean;
  features?: string[];
  AllocatedAddons?: any[];
  Created_Date?: string;
  [key: string]: any;
}

export interface SubscriptionRecord {
  id: string | number;
  Subscription_Id?: string;
  subscription_id?: string;
  Subscription_Name: string;
  Customer_Id?: string | number;
  Customer_Name: string;
  customer_name?: string;
  Plan_Id?: string | number;
  Plan_Name: string;
  plan_name?: string;
  No_Of_Users?: number;
  no_of_users?: number;
  Base_Users?: number;
  UnitPrice?: number;
  SuscriptionAmount?: number;
  TaxAmount?: number;
  discount?: number;
  start_date?: string;
  end_date?: string;
  status: "active" | "trial" | "inactive" | "expired" | string;
  Basestorage_Size?: string | number;
  storage_limit?: any;
  account_id?: any;
  Server_cost?: number;
  Operation_cost?: number;
  auto_renew?: boolean;
  Updated_Date?: string;
  [key: string]: any;
}

export interface InvoiceRecord {
  id: string | number;
  Invoice_Id: string;
  Invoice_Date: string;
  InvoiceAmount: number;
  TaxAmount?: number;
  NetAmount: number;
  Customer_Id?: any;
  Customer_Name?: string;
  Subscription_Id?: any;
  Subscription_Name?: string;
  InvoiceFor?: string;
  Payment_Status?: string;
  Is_Archived?: boolean; // Payment Status: true = Paid, false = Pending / Unpaid
  Is_Deleted?: boolean;
  Payment_Terms?: string;
  Created_Date?: string;
  Updated_Date?: string;
  [key: string]: any;
}

export interface PaymentRecord {
  id: string | number;
  Payment_Id?: string;
  Invoice_Id?: any;
  Invoice_id?: any;
  Invoice_No?: string;
  Invoice_Number?: string;
  Customer_Id?: any;
  Customer_Name: string;
  Subscription_Id?: any;
  Subscription_id?: any;
  Subscription_Name?: string;
  NoofUsers?: number;
  Payment_Date: string;
  Invoice_Date?: string;
  Payment_Mode: string;
  paid_amount: number;
  InvoiceAmount?: number;
  TaxAmount?: number;
  NetAmount?: number;
  Total_Amount?: number;
  Amount?: number;
  Transaction_No?: string;
  Payment_details?: string;
  status: "success" | "pending" | "failed" | string;
  Created_Date?: string;
  [key: string]: any;
}

export interface InstanceRequestRecord {
  id: string | number;
  RequestId?: string;
  InstanceName: string;
  CustomerName: string;
  Customer_Id?: any;
  PlanName: string;
  product_type: string;
  NoofUsers: number;
  Subscription_Id?: any;
  SubscriptionId?: any;
  InvoiceNo?: string;
  Amount?: number;
  Url?: string;
  RequestDate?: string;
  InstanceCreatedFlag?: boolean;
  Created_Date?: string;
}

export interface InstanceCreationRecord {
  id: string | number;
  Instance_Request_No: string;
  Customer_Name: string;
  Customer_Id?: any;
  Customer_Email?: string;
  Domain_Name: string;
  Database_Name: string;
  Subscription_Id?: any;
  product_type: string;
  Tenant_Frontend_URL?: string;
  Tenant_Backend_URL?: string;
  Status?: string;
  Created_Date?: string;
}

export interface AdditionalLicenseRecord {
  id: string | number;
  Licensereqid: string;
  Customername: string;
  Customer_Id?: any;
  Planname: string;
  Plan_Id?: any;
  Subscription_Id?: any;
  Requestedusers: number;
  UserPerAmount: number;
  UserTotalAmount: number;
  RequestDate: string;
  Currency_code?: string;
  Paymentsflg?: boolean;
  Invoiceflg?: boolean;
  sync_status?: string;
  proformaInvoiceflg?: boolean;
  Created_Date?: string;
  Status?: string;
  payment_status?: string;
}

export interface AddonSubscriptionRecord {
  id: string | number;
  Addonsubscriptionid?: string;
  Addonsubscriptionname?: string;
  Customername: string;
  Customer_Name?: string;
  Customer_Id?: any;
  Planname: string;
  Plan_Name?: string;
  Plan_Id?: any;
  Subscription_Id?: any;
  RequestDate: string;
  UnitPrice?: number;
  TotalAmount?: number;
  Price?: any;
  Amount?: any;
  Currency_code?: string;
  Paymentsflg?: boolean;
  Invoiceflg?: boolean;
  Created_Date?: string;
  Status?: string;
  payment_status?: string;
}

export interface AdditionalStorageRecord {
  id: string | number;
  Storage_Id?: string;
  AddStorageRequestKey?: string;
  Customername?: string;
  Customer_Name?: string;
  Customer_Id?: any;
  Planname?: string;
  Plan_Name?: string;
  Subscription_Id?: any;
  Requestedstorage?: number;
  Additionalstorage?: number | string;
  AllocatedStorage?: number;
  storagePerAmount?: number;
  UnitPrice?: number | string;
  storageTotalAmount?: number | string;
  NetAdditionalAmount?: number;
  Price?: any;
  UserTotalAmount?: any;
  RequestDate: string;
  Paymentsflg?: boolean;
  Invoiceflg?: boolean;
  Created_Date?: string;
  Status?: string;
  payment_status?: string;
}

export interface RenewalDueRecord {
  id: string | number;
  Renewal_Id: string;
  Customer_Name: string;
  Customer_Id?: any;
  Producttype?: string;
  PlanNetAmount?: number;
  RenewalAmount?: number | string;
  PlangrossAmount?: number;
  PlanTaxAmount?: number;
  Requestedusers?: number;
  RequestedPlan_Id?: any;
  old_Subscription_id?: any;
  new_Subscription_id?: any;
  Renewal_Status?: string;
  status?: string;
  Status?: string;
  Payment_Status?: string;
  RenewalPeriod?: string;
  Plan_Name?: string;
  Subscription_Id?: any;
  RenewalDate?: string;
  TaxAmount?: any;
  Amount?: any;
  Created_Date?: string;
}

export interface CancelPlanRecord {
  id: string | number;
  CancelPlan_Id?: string;
  Customer_Name?: string;
  CustomerName?: string;
  Domain_Name?: string;
  DomainName?: string;
  Plan_Name?: string;
  PlanName?: string;
  Noofusers?: number;
  No_Of_Users?: number;
  ExpireDate?: string;
  EffectiveCancelDate?: string;
  Reason?: string;
  Status?: string;
  Created_Date?: string;
  [key: string]: any;
}

export interface TaskRecord {
  id: string | number;
  Task_Id?: string;
  TaskName: string;
  Task_Name?: string;
  Task_Desc?: string;
  Task_Description?: string;
  Description?: string;
  Start_Date?: string;
  Due_Date?: string;
  Priority?: "Low" | "Normal" | "High" | string;
  Completion?: string;
  Status?: "Not Started" | "In Progress" | "Completed" | string;
  Project?: any;
  Project_Name?: string;
  Assigned_By?: any;
  Assigned_To?: any;
  Assign_To?: any;
  Created_Date?: string;
  Created_At?: string;
  Updated_Date?: string;
  Created_By?: any;
  UserReminder?: any;
  [key: string]: any;
}

export interface TicketGroupRecord {
  id: string | number;
  Related_to: string;
  TicketRelatesto?: string;
  Members: string[];
  AssigntoUser?: Array<{ id: any; Employee: string }>;
  allow?: boolean;
}

export interface TicketRecord {
  id: string | number;
  Ticket_No?: string;
  Ticket_Name?: string;
  Related_Module?: string;
  TicketRelatesto?: string;
  Details?: string;
  Ticket_Description?: string;
  Severity?: "Critical" | "Major" | "Minor" | "Normal" | string;
  Priority?: string;
  Ticket_Status?:
    | "New"
    | "Open"
    | "In Progress"
    | "Pending"
    | "Fixed"
    | "Closed"
    | string;
  Status?: string;
  RisedBy?: any;
  Created_By?: any;
  Created_Date?: string;
  DeadlineDate?: string;
  Assigned_To?: string;
  Members?: any;
}

export interface ProductMenuRecord {
  id: string | number;
  name: string;
  code: string;
  type?: "module" | "submodule" | "form" | string;
  parent?: any;
  display_order?: number;
  is_active?: boolean;
  actions?: Record<string, boolean>;
  product?: string;
  children?: ProductMenuRecord[];
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  userRole: string;
  timestamp: string;
  reason?: string;
  comment?: string;
}

export interface AuditHistoryEntry {
  id: string;
  action:
    | "CREATE"
    | "UPDATE"
    | "DEACTIVATE"
    | "ACTIVATE"
    | "APPROVAL_SUBMIT"
    | "APPROVED"
    | "REJECTED"
    | "DELETE";
  performedBy: string;
  userRole: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
  changes?: Array<{ field: string; oldValue: any; newValue: any }>;
}

export interface ProductMasterRecord {
  id: string;
  product_code: string;
  product_name: string;
  description: string;
  short_description?: string;
  category: string;
  product_icon?: string;
  icon_name?: string;
  website_url?: string;
  default_edition?: string;
  status: "Active" | "Inactive" | "Draft" | "Under Review" | "Archived";
  display_order: number;
  editions_count?: number;
  editions?: string[];
  editions_details?: any[];
  modules_count?: number;
  modules?: string[];
  region?: string;
  current_version?: string;
  release_date?: string;
  lifecycle_stage?: string;
  logo_file?: string;
  logo_dimensions?: string;
  icon_file?: string;
  icon_dimensions?: string;
  icon_type?: string;
  approval_status: "Approved" | "Pending Approval" | "Draft" | "Rejected";
  approval_notes?: string;
  submitted_for_approval?: boolean;
  created_at: string;
  updated_at: string;
  status_history: StatusHistoryEntry[];
  audit_history: AuditHistoryEntry[];
}

export interface CompanyDetailsRecord {
  id?: string | number;
  company_name: string;
  registration_no?: string;
  email: string;
  phone_number: string;
  website?: string;
  currency: string;
  currency_format?: string;
  timezone?: string;
  fiscal_year_start?: string | number;
  date_format?: string;
  company_logo?: string;
  address?: {
    building_door_no?: string;
    street_name?: string;
    area_name?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  bank_details?: {
    ifsc_code?: string;
    bank_name?: string;
    account_number?: string;
    account_type?: string;
    swift_code?: string;
    branch?: string;
    bank_address?: string;
  };
  business_hours?: {
    start_time?: string;
    end_time?: string;
    working_days?: string[];
  };
}

export interface RoleRecord {
  id: string | number;
  Role_Id?: string;
  name?: string;
  Role_Name: string;
  Role_Description?: string;
  permissions?: any;
  Created_Date?: string;
  Updated_Date?: string;
  Is_Deleted?: boolean;
  user_count?: number;
}

export interface UserAdminRecord {
  id: string | number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  role?: string;
  Role_Name?: string;
  is_active: boolean;
  Created_Date?: string;
}

export interface StorageMasterRecord {
  id: string | number;
  Storage_Id?: string;
  Name: string;
  Storage_Size: string;
  Price: number;
  Country?: string;
  Currency?: string;
  Isactive: boolean;
  Is_Deleted?: boolean;
  Created_Date?: string;
}

export interface UserMasterRecord {
  id: string | number;
  No_Of_Users: number;
  Amount_Per_User: number;
  Total_Amount: number;
  Effective_Date?: string;
  Status: "pending" | "approved" | "rejected" | "active" | string;
  Currency_code?: string;
  Country?: string;
  Is_active: boolean;
  Is_Deleted?: boolean;
}

export interface AddonMasterRecord {
  id: string | number;
  Addon_Id?: string;
  Addon_Name: string;
  Price: number;
  NoofUsers?: number;
  Currency_code?: string;
  Country?: string;
  Started_Date?: string;
  Is_Active: boolean;
  Is_Deleted?: boolean;
}

export interface SystemPreferenceRecord {
  id?: string | number;
  DateFormat?: string;
  Password?: string;
  ResetPassword?: boolean;
  ForcePasswordChange?: boolean;
  PasswordExpiryDays?: number;
  LoginValidityType?: "DATE" | "DAYS" | string;
  ValidFrom?: string;
  ValidTo?: string;
  LockAfterFailedAttempts?: number;
  hide_display_negative_sentiment?: boolean;
  hide_display_inactive_leads?: boolean;
  hide_display_inactive_users?: boolean;
}

// ----------------------------------------------------------------------
// FALLBACK MOCK DATA
// ----------------------------------------------------------------------

export const MOCK_ACCOUNTS: AccountRecord[] = [
  {
    id: 101,
    Organization_Name: "Apex Global Technologies",
    Contact_Name: "Marcus Wright",
    Mail: "marcus.w@apexglobal.io",
    Phone_Number: "+1 415-555-0192",
    Industry: "Information Technology & SaaS",
    Employees: "250",
    Turn_Over: "$12M",
    GST_No: "29ABCDE1234F1Z5",
    Payment_Terms: "Net 30",
    Country: "United States",
    State: "California",
    City: "San Francisco",
    Account_Owner: "admin",
    Active_Flag: true,
    Created_Date: "2026-08-15",
  },
  {
    id: 102,
    Organization_Name: "CloudTech Solutions Ltd",
    Contact_Name: "Sophia Chen",
    Mail: "schen@cloudtech.com",
    Phone_Number: "+1 415-555-0144",
    Industry: "Cloud Infrastructure",
    Employees: "120",
    Turn_Over: "$6.5M",
    GST_No: "33AABCC5678K1Z2",
    Payment_Terms: "Immediate",
    Country: "United States",
    State: "Washington",
    City: "Seattle",
    Account_Owner: "admin",
    Active_Flag: true,
    Created_Date: "2026-09-02",
  },
  {
    id: 103,
    Organization_Name: "Nexus Logistics Corp",
    Contact_Name: "Robert Vance",
    Mail: "rvance@nexuslogistics.com",
    Phone_Number: "+1 312-555-0188",
    Industry: "Supply Chain & Manufacturing",
    Employees: "450",
    Turn_Over: "$28M",
    GST_No: "27AABCT9988D1Z9",
    Payment_Terms: "Net 60",
    Country: "United States",
    State: "Illinois",
    City: "Chicago",
    Account_Owner: "admin",
    Active_Flag: true,
    Created_Date: "2026-09-20",
  },
  {
    id: 104,
    Organization_Name: "Starlight Retail Hub",
    Contact_Name: "Elena Rostova",
    Mail: "elena@starlightretail.org",
    Phone_Number: "+1 212-555-0177",
    Industry: "E-commerce & Retail",
    Employees: "85",
    Turn_Over: "$4.2M",
    GST_No: "36AAACB1122J1Z0",
    Payment_Terms: "Net 15",
    Country: "United States",
    State: "New York",
    City: "New York",
    Account_Owner: "admin",
    Active_Flag: true,
    Created_Date: "2026-10-10",
  },
];

export const MOCK_PLANS: PlanRecord[] = [
  {
    id: 1,
    name: "Starter Cloud Tier",
    code: "PLN-START-01",
    Producttype: "SuperAdmin Cloud",
    plantype: "Paid",
    price: 49,
    monthly_price: 49,
    yearly_price: 490,
    currency: "USD",
    noofuser: 10,
    max_users: 10,
    noofcontact: 5000,
    storage: 50,
    max_storage_gb: 50,
    trailperiod: 14,
    billing_cycle: "Monthly",
    description: "Perfect for small growing teams and initial cloud setup.",
    is_active: true,
    features: ["Dashboard & Telemetry", "Customer & Tenant Admin"],
    Created_Date: "2026-06-01",
  },
  {
    id: 2,
    name: "Business Pro Suite",
    code: "PLN-BIZPRO-02",
    Producttype: "CRM Enterprise",
    plantype: "Paid",
    price: 199,
    monthly_price: 199,
    yearly_price: 1990,
    currency: "USD",
    noofuser: 50,
    max_users: 50,
    noofcontact: 25000,
    storage: 250,
    max_storage_gb: 250,
    trailperiod: 14,
    billing_cycle: "Yearly",
    description:
      "Comprehensive enterprise CRM & subscription fleet management.",
    is_active: true,
    features: [
      "Dashboard & Telemetry",
      "Customer & Tenant Admin",
      "Subscription Management",
      "Analytics & Revenue Reports",
    ],
    Created_Date: "2026-06-15",
  },
  {
    id: 3,
    name: "Enterprise Platinum",
    code: "PLN-ENTPLT-03",
    Producttype: "ERP Core",
    plantype: "Paid",
    price: 599,
    monthly_price: 599,
    yearly_price: 5990,
    currency: "USD",
    noofuser: 250,
    max_users: 250,
    noofcontact: 100000,
    storage: 1000,
    max_storage_gb: 1000,
    trailperiod: 30,
    billing_cycle: "Yearly",
    description:
      "Dedicated high-availability cloud cluster with white-label support and unlimited integrations.",
    is_active: true,
    features: [
      "Dashboard & Telemetry",
      "Customer & Tenant Admin",
      "Subscription Management",
      "Analytics & Revenue Reports",
      "Role & Permission Matrix",
      "Defect & Ticket Desk",
    ],
    Created_Date: "2026-07-01",
  },
];

export const MOCK_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 201,
    Subscription_Id: "SUB-2026-001",
    Subscription_Name: "Apex Annual Enterprise Fleet",
    Customer_Id: 101,
    Customer_Name: "Apex Global Technologies",
    Plan_Id: 3,
    Plan_Name: "Enterprise Platinum",
    No_Of_Users: 250,
    Base_Users: 250,
    UnitPrice: 5990,
    SuscriptionAmount: 5990,
    TaxAmount: 599,
    discount: 0,
    start_date: "2026-08-15",
    end_date: "2027-08-14",
    status: "active",
    Basestorage_Size: 1000,
    auto_renew: true,
    Updated_Date: "2026-08-15",
  },
  {
    id: 202,
    Subscription_Id: "SUB-2026-002",
    Subscription_Name: "CloudTech Growth Subscription",
    Customer_Id: 102,
    Customer_Name: "CloudTech Solutions Ltd",
    Plan_Id: 2,
    Plan_Name: "Business Pro Suite",
    No_Of_Users: 120,
    Base_Users: 50,
    UnitPrice: 1990,
    SuscriptionAmount: 2388,
    TaxAmount: 238,
    discount: 5,
    start_date: "2026-09-02",
    end_date: "2027-09-01",
    status: "active",
    Basestorage_Size: 250,
    auto_renew: true,
    Updated_Date: "2026-09-02",
  },
  {
    id: 203,
    Subscription_Id: "SUB-2026-003",
    Subscription_Name: "Nexus Global Logistics Fleet",
    Customer_Id: 103,
    Customer_Name: "Nexus Logistics Corp",
    Plan_Id: 3,
    Plan_Name: "Enterprise Platinum",
    No_Of_Users: 400,
    Base_Users: 250,
    UnitPrice: 5990,
    SuscriptionAmount: 7850,
    TaxAmount: 785,
    discount: 10,
    start_date: "2026-09-20",
    end_date: "2027-09-19",
    status: "active",
    Basestorage_Size: 1500,
    auto_renew: true,
    Updated_Date: "2026-09-20",
  },
  {
    id: 204,
    Subscription_Id: "SUB-2026-004",
    Subscription_Name: "Starlight Retail Trial",
    Customer_Id: 104,
    Customer_Name: "Starlight Retail Hub",
    Plan_Id: 1,
    Plan_Name: "Starter Cloud Tier",
    No_Of_Users: 10,
    Base_Users: 10,
    UnitPrice: 49,
    SuscriptionAmount: 0,
    TaxAmount: 0,
    discount: 100,
    start_date: "2026-11-10",
    end_date: "2026-11-24",
    status: "trial",
    Basestorage_Size: 50,
    auto_renew: false,
    Updated_Date: "2026-11-10",
  },
];

export const MOCK_INVOICES: InvoiceRecord[] = [
  {
    id: 301,
    Invoice_Id: "INV-2026-001",
    Invoice_Date: "2026-11-01",
    InvoiceAmount: 2200,
    TaxAmount: 396,
    NetAmount: 2596,
    Customer_Name: "Apex Global Technologies",
    Customer_Id: 101,
    Subscription_Id: 201,
    Subscription_Name: "Apex Core Enterprise Tier",
    Is_Archived: true,
    Payment_Terms: "Net 30",
    Created_Date: "2026-11-01",
  },
  {
    id: 302,
    Invoice_Id: "INV-2026-002",
    Invoice_Date: "2026-11-05",
    InvoiceAmount: 480,
    TaxAmount: 86.4,
    NetAmount: 566.4,
    Customer_Name: "CloudTech Solutions Ltd",
    Customer_Id: 102,
    Subscription_Id: 202,
    Subscription_Name: "CloudTech Pro Growth License",
    Is_Archived: false,
    Payment_Terms: "Immediate",
    Created_Date: "2026-11-05",
  },
  {
    id: 303,
    Invoice_Id: "INV-2026-003",
    Invoice_Date: "2026-11-08",
    InvoiceAmount: 7065,
    TaxAmount: 785,
    NetAmount: 7850,
    Customer_Name: "Nexus Logistics Corp",
    Customer_Id: 103,
    Subscription_Id: 203,
    Subscription_Name: "Nexus Global Logistics Fleet",
    Is_Archived: true,
    Payment_Terms: "Net 30",
    Created_Date: "2026-11-08",
  },
  {
    id: 304,
    Invoice_Id: "INV-2026-004",
    Invoice_Date: "2026-11-12",
    InvoiceAmount: 1250,
    TaxAmount: 225,
    NetAmount: 1475,
    Customer_Name: "Innovate Healthcare Systems",
    Customer_Id: 105,
    Subscription_Id: 204,
    Subscription_Name: "Innovate Med Cloud",
    Is_Archived: false,
    Payment_Terms: "Net 15",
    Created_Date: "2026-11-12",
  },
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: 401,
    Payment_Id: "PAY-2026-001",
    Invoice_Id: 301,
    Invoice_No: "INV-2026-001",
    Customer_Id: 101,
    Customer_Name: "Apex Global Technologies",
    Subscription_Id: 201,
    Payment_Date: "2026-11-02",
    Payment_Mode: "Online",
    paid_amount: 2596,
    InvoiceAmount: 2200,
    TaxAmount: 396,
    NetAmount: 2596,
    Transaction_No: "TXN-98471203",
    Payment_details: "Stripe Corporate Transfer",
    status: "success",
    Created_Date: "2026-11-02",
  },
  {
    id: 402,
    Payment_Id: "PAY-2026-002",
    Invoice_Id: 303,
    Invoice_No: "INV-2026-003",
    Customer_Id: 103,
    Customer_Name: "Nexus Logistics Corp",
    Subscription_Id: 203,
    Payment_Date: "2026-11-09",
    Payment_Mode: "UPI",
    paid_amount: 7850,
    InvoiceAmount: 7065,
    TaxAmount: 785,
    NetAmount: 7850,
    Transaction_No: "UPI-39281094",
    Payment_details: "Bank Direct Settlement",
    status: "success",
    Created_Date: "2026-11-09",
  },
];

export const MOCK_INSTANCE_REQUESTS: InstanceRequestRecord[] = [
  {
    id: 501,
    RequestId: "REQ-2026-001",
    InstanceName: "apex-global",
    CustomerName: "Apex Global Technologies",
    Customer_Id: 101,
    PlanName: "Enterprise Platinum",
    product_type: "pegatto crm",
    NoofUsers: 250,
    SubscriptionId: 201,
    Amount: 2596,
    Url: "https://apex-global.crmfarm.app",
    RequestDate: "2026-11-02",
    InstanceCreatedFlag: true,
    Created_Date: "2026-11-02",
  },
  {
    id: 502,
    RequestId: "REQ-2026-002",
    InstanceName: "cloudtech-app",
    CustomerName: "CloudTech Solutions Ltd",
    Customer_Id: 102,
    PlanName: "Business Pro Suite",
    product_type: "crm",
    NoofUsers: 50,
    SubscriptionId: 202,
    Amount: 566.4,
    Url: "https://cloudtech-app.crmfarm.app",
    RequestDate: "2026-11-06",
    InstanceCreatedFlag: false,
    Created_Date: "2026-11-06",
  },
  {
    id: 503,
    RequestId: "REQ-2026-003",
    InstanceName: "nexus-logistics",
    CustomerName: "Nexus Logistics Corp",
    Customer_Id: 103,
    PlanName: "Enterprise Platinum",
    product_type: "retail",
    NoofUsers: 400,
    SubscriptionId: 203,
    Amount: 7850,
    Url: "https://nexus-logistics.crmfarm.app",
    RequestDate: "2026-11-10",
    InstanceCreatedFlag: true,
    Created_Date: "2026-11-10",
  },
];

export const MOCK_INSTANCE_CREATIONS: InstanceCreationRecord[] = [
  {
    id: 601,
    Instance_Request_No: "REQ-2026-001",
    Customer_Name: "Apex Global Technologies",
    Customer_Id: 101,
    Customer_Email: "admin@apexglobal.io",
    Domain_Name: "apex-global",
    Database_Name: "apex_global_db",
    Subscription_Id: 201,
    product_type: "pegatto crm",
    Tenant_Frontend_URL: "https://apex-global.crmfarm.app/",
    Tenant_Backend_URL: "https://backend.crmfarm.app/apex-global",
    Status: "active",
    Created_Date: "2026-11-03",
  },
  {
    id: 602,
    Instance_Request_No: "REQ-2026-003",
    Customer_Name: "Nexus Logistics Corp",
    Customer_Id: 103,
    Customer_Email: "ops@nexuslogistics.com",
    Domain_Name: "nexus-logistics",
    Database_Name: "nexus_logistics_db",
    Subscription_Id: 203,
    product_type: "retail",
    Tenant_Frontend_URL: "https://nexus-logistics.crmfarm.app/",
    Tenant_Backend_URL: "https://backend.crmfarm.app/nexus-logistics",
    Status: "active",
    Created_Date: "2026-11-11",
  },
];

export const MOCK_REVENUE_FORECAST: RevenueForecastData = {
  current_mrr: 125000,
  current_arr: 1500000,
  mrr_trend: [
    { month: "2024-01", mrr: 88000 },
    { month: "2024-02", mrr: 94000 },
    { month: "2024-03", mrr: 102000 },
    { month: "2024-04", mrr: 110000 },
    { month: "2024-05", mrr: 118000 },
    { month: "2024-06", mrr: 125000 },
  ],
  arr_trend: [
    { month: "2024-01", arr: 1056000 },
    { month: "2024-02", arr: 1128000 },
    { month: "2024-03", arr: 1224000 },
    { month: "2024-04", arr: 1320000 },
    { month: "2024-05", arr: 1416000 },
    { month: "2024-06", arr: 1500000 },
  ],
};

export const MOCK_PAYMENT_HIGHLIGHTS: PaymentHighlightsData = {
  total_invoiced: 2845000.0,
  outstanding_amount: 142000.0,
  payment_success_rate: 98.4,
  failed_payments: 6,
  avg_payment_delay_days: 2.4,
};

export const MOCK_TOP_PLANS: TopPlansData = {
  labels: [
    "Enterprise Platinum",
    "Business Pro Suite",
    "Starter Cloud Tier",
    "Custom Solutions",
  ],
  counts: [142, 98, 64, 26],
};

export const MOCK_RENEWAL_FUNNEL: RenewalFunnelData = {
  due_this_month: 240,
  invoice_generated: 215,
  payment_received: 198,
  failed: 8,
};

export const MOCK_REQUEST_DISTRIBUTION: RequestDistributionData = {
  total_requests: 184,
  invoice_generated_requests: 126,
  pending_invoice_requests: 18,
  instance_created: 142,
  instance_pending: 12,
  request_distribution: [
    { module: "Plan Upgrade", count: 72 },
    { module: "Instance Scaling", count: 48 },
    { module: "Addon Allocation", count: 64 },
  ],
};

export const MOCK_PLAN_ADOPTION: PlanAdoptionData = {
  total_active_subscriptions: 3840,
  trial_conversion_rate: 68.4,
  plan_breakdown: [
    { plan_name: "Enterprise Platinum", count: 1420, percentage: 44 },
    { plan_name: "Business Pro Suite", count: 1180, percentage: 32 },
    { plan_name: "Starter Cloud Tier", count: 850, percentage: 18 },
    { plan_name: "Custom Fleet", count: 390, percentage: 6 },
  ],
};

export const MOCK_RENEWAL_ANALYTICS: RenewalAnalyticsData = {
  renewal_rate: 94.2,
  upcoming_renewals_count: 320,
  renewed_count: 298,
};

export const MOCK_CANCELLATION_ANALYTICS: CancellationAnalyticsData = {
  total_cancellations: 42,
  churn_rate: 1.8,
  reasons: [
    { reason: "Budget Constraints", count: 18 },
    { reason: "Downsizing / Mergers", count: 12 },
    { reason: "Migrated to Custom Stack", count: 8 },
    { reason: "Other", count: 4 },
  ],
};

export const MOCK_SUBSCRIPTION_ANALYTICS: SubscriptionAnalyticsData = {
  active: 3840,
  trial: 420,
  expired: 86,
  renewal_rate: 94.2,
  mrr: 125000,
  arr: 1500000,
};

export const MOCK_SUBSCRIPTION_INSIGHTS: SubscriptionInsightsData = {
  churn_by_product: [
    { product: "Enterprise Platinum", total: 12 },
    { product: "Business Pro Suite", total: 24 },
    { product: "Starter Cloud Tier", total: 45 },
    { product: "Custom Plan", total: 8 },
  ],
  growth_rate: 18.5,
  arpa: 420,
};

export const MOCK_USAGE_ANALYTICS: UsageAnalyticsData = {
  dau_trend: [
    { date: "Mon", active_users: 1420 },
    { date: "Tue", active_users: 1680 },
    { date: "Wed", active_users: 1890 },
    { date: "Thu", active_users: 2100 },
    { date: "Fri", active_users: 2450 },
    { date: "Sat", active_users: 1750 },
    { date: "Sun", active_users: 1620 },
  ],
  total_storage_gb: 4820,
  api_calls_today: 184500,
};

export const MOCK_INSTANCE_ANALYTICS: InstanceAnalyticsData = {
  growth: [
    { period: "Jan", total: 110, active: 104 },
    { period: "Feb", total: 135, active: 128 },
    { period: "Mar", total: 160, active: 154 },
    { period: "Apr", total: 195, active: 188 },
    { period: "May", total: 230, active: 224 },
    { period: "Jun", total: 275, active: 268 },
  ],
  total_instances: 275,
  healthy_count: 271,
  avg_cpu_percent: 34.2,
  avg_memory_percent: 58.7,
};

export const MOCK_TASKS: TaskRecord[] = [
  {
    id: 1,
    Task_Id: "TSK-1001",
    TaskName: "Tenant DB Sharding Migration",
    Task_Name: "Tenant DB Sharding Migration",
    Task_Desc:
      "Partition Postgres DB across isolated tenant schemas for SaaS scalability.",
    Start_Date: "2026-11-01",
    Due_Date: "2026-11-20",
    Priority: "High",
    Completion: "70%",
    Status: "In Progress",
    Project: "Infrastructure Scaling",
    Project_Name: "Infrastructure Scaling",
    Assigned_By: "SuperAdmin Admin",
    Created_Date: "2026-11-01",
  },
  {
    id: 2,
    Task_Id: "TSK-1002",
    TaskName: "SSL Automated Certificate Renewal",
    Task_Name: "SSL Automated Certificate Renewal",
    Task_Desc:
      "Implement Let’s Encrypt automated challenge validation on tenant subdomains.",
    Start_Date: "2026-11-05",
    Due_Date: "2026-11-15",
    Priority: "Normal",
    Completion: "100%",
    Status: "Completed",
    Project: "Security & Compliance",
    Project_Name: "Security & Compliance",
    Assigned_By: "SuperAdmin Admin",
    Created_Date: "2026-11-05",
  },
  {
    id: 3,
    Task_Id: "TSK-1003",
    TaskName: "Invoice PDF Rendering Optimization",
    Task_Name: "Invoice PDF Rendering Optimization",
    Task_Desc:
      "Refactor html2canvas and jsPDF export templates for instant generation.",
    Start_Date: "2026-11-12",
    Due_Date: "2026-11-28",
    Priority: "Normal",
    Completion: "25%",
    Status: "Not Started",
    Project: "Sales Billing Module",
    Project_Name: "Sales Billing Module",
    Assigned_By: "SuperAdmin Admin",
    Created_Date: "2026-11-12",
  },
];

export const MOCK_TICKET_GROUPS: TicketGroupRecord[] = [
  {
    id: 1,
    Related_to: "Billing Issue",
    TicketRelatesto: "Billing Issue",
    Members: ["Sarah Jenkins", "Finance Support Team"],
    allow: false,
  },
  {
    id: 2,
    Related_to: "Software Bug",
    TicketRelatesto: "Software Bug",
    Members: ["Core Dev Team", "Alex Rivera"],
    allow: false,
  },
  {
    id: 3,
    Related_to: "Account Access",
    TicketRelatesto: "Account Access",
    Members: ["DevOps Security", "IT Support"],
    allow: false,
  },
  {
    id: 4,
    Related_to: "Feature Request",
    TicketRelatesto: "Feature Request",
    Members: ["Product Management Team"],
    allow: false,
  },
];

export const MOCK_TICKETS: TicketRecord[] = [
  {
    id: 1,
    Ticket_No: "TCK-8091",
    Ticket_Name: "Tenant Domain SSL handshake timeout",
    Related_Module: "Infrastructure",
    TicketRelatesto: "Account Access",
    Details:
      "Custom domain edge certificate is not resolving on tenant CNAME record.",
    Severity: "Critical",
    Priority: "High",
    Ticket_Status: "Open",
    Status: "Open",
    Created_Date: "2026-11-15",
    DeadlineDate: "2026-11-18",
    Assigned_To: "DevOps Security",
  },
  {
    id: 2,
    Ticket_No: "TCK-8092",
    Ticket_Name: "GST calculation rounding discrepancy in invoice",
    Related_Module: "Billing",
    TicketRelatesto: "Billing Issue",
    Details:
      "Invoice net amount differs by 2 paise due to floating point round in tax formula.",
    Severity: "Major",
    Priority: "Medium",
    Ticket_Status: "In Progress",
    Status: "In Progress",
    Created_Date: "2026-11-16",
    DeadlineDate: "2026-11-22",
    Assigned_To: "Sarah Jenkins",
  },
  {
    id: 3,
    Ticket_No: "TCK-8093",
    Ticket_Name: "Request for CSV export on customer audit report",
    Related_Module: "Reports",
    TicketRelatesto: "Feature Request",
    Details:
      "Enterprise customer requests bulk CSV download button on weekly usage charts.",
    Severity: "Normal",
    Priority: "Low",
    Ticket_Status: "New",
    Status: "New",
    Created_Date: "2026-11-17",
    DeadlineDate: "2026-11-30",
    Assigned_To: "Product Management Team",
  },
];

export const MOCK_PRODUCT_MENUS: ProductMenuRecord[] = [
  {
    id: 1,
    name: "Dashboard Overview",
    code: "dashboard.overview",
    type: "module",
    display_order: 1,
    is_active: true,
    actions: { create: true, edit: true, delete: false, overview: true },
  },
  {
    id: 2,
    name: "Customer Management",
    code: "customer.management",
    type: "module",
    display_order: 2,
    is_active: true,
    actions: { create: true, edit: true, delete: true, overview: true },
  },
  {
    id: 3,
    name: "Sales & Billing",
    code: "sales.billing",
    type: "module",
    display_order: 3,
    is_active: true,
    actions: { create: true, edit: true, delete: true, overview: true },
  },
  {
    id: 4,
    name: "Settings & Administration",
    code: "settings.admin",
    type: "module",
    display_order: 4,
    is_active: true,
    actions: { create: true, edit: true, delete: false, overview: true },
  },
];

export const MOCK_PRODUCT_MASTERS: ProductMasterRecord[] = [
  {
    id: "prd-1",
    product_code: "PRD-ERP-CORE",
    product_name: "PEGATTO ERP Core",
    description:
      "Comprehensive enterprise resource planning system covering end-to-end supply chain, multi-currency ledger, smart procurement, warehouse inventory, and automated audits.",
    category: "ERP",
    product_icon: "",
    icon_name: "erp_core_icon.png",
    website_url: "https://pegatto.com/products/erp-core",
    default_edition: "Enterprise",
    status: "Active",
    display_order: 1,
    editions_count: 4,
    editions: ["Starter", "Professional", "Enterprise", "Ultimate Global"],
    modules_count: 8,
    modules: [
      "Inventory Control",
      "Procurement",
      "Ledger Accounting",
      "Asset Management",
      "Supply Chain",
      "Order Fulfillment",
      "Tax Engine",
      "Audit Reports",
    ],
    region: "Global",
    approval_status: "Approved",
    approval_notes:
      "Production approved by SuperAdmin for global availability.",
    created_at: "2026-01-10T09:30:00Z",
    updated_at: "2026-11-15T14:20:00Z",
    status_history: [
      {
        id: "sh-1",
        fromStatus: "Draft",
        toStatus: "Under Review",
        changedBy: "Sarah Connor",
        userRole: "Product Manager",
        timestamp: "2026-01-08T10:00:00Z",
        reason:
          "Initial master catalog configuration ready for SuperAdmin review",
      },
      {
        id: "sh-2",
        fromStatus: "Under Review",
        toStatus: "Active",
        changedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-01-10T09:30:00Z",
        reason: "Commercial release sign-off",
      },
    ],
    audit_history: [
      {
        id: "ah-1",
        action: "CREATE",
        performedBy: "Sarah Connor",
        userRole: "Product Manager",
        timestamp: "2026-01-08T09:15:00Z",
        details: "Product Master record created with 4 editions and 8 modules.",
        ipAddress: "192.168.1.104",
      },
      {
        id: "ah-2",
        action: "APPROVED",
        performedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-01-10T09:30:00Z",
        details: "Product approved and status set to Active.",
        ipAddress: "10.0.0.1",
      },
      {
        id: "ah-3",
        action: "UPDATE",
        performedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-11-15T14:20:00Z",
        details: "Updated website URL and display order.",
        ipAddress: "10.0.0.1",
        changes: [{ field: "display_order", oldValue: 2, newValue: 1 }],
      },
    ],
  },
  {
    id: "prd-2",
    product_code: "PRD-CRM-ENT",
    product_name: "PEGATTO CRM Enterprise",
    description:
      "High-performance customer relationship management with automated sales funnels, omnichannel communication hubs, contact intelligence, and predictive revenue pipeline forecasting.",
    category: "CRM",
    product_icon: "",
    icon_name: "crm_enterprise_icon.png",
    website_url: "https://pegatto.com/products/crm-enterprise",
    default_edition: "Professional",
    status: "Active",
    display_order: 2,
    editions_count: 3,
    editions: ["Standard", "Professional", "Enterprise"],
    modules_count: 6,
    modules: [
      "Lead Tracking",
      "Deal Pipeline",
      "Contact Center",
      "Campaign Engine",
      "Quotation Generator",
      "Customer Health Score",
    ],
    region: "North America",
    approval_status: "Approved",
    approval_notes: "Fully vetted and released.",
    created_at: "2026-02-14T11:15:00Z",
    updated_at: "2026-11-16T16:45:00Z",
    status_history: [
      {
        id: "sh-3",
        fromStatus: "Draft",
        toStatus: "Active",
        changedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-02-14T11:15:00Z",
        reason: "Direct deployment with standard template",
      },
    ],
    audit_history: [
      {
        id: "ah-4",
        action: "CREATE",
        performedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-02-14T11:15:00Z",
        details: "Initial record created.",
        ipAddress: "10.0.0.1",
      },
    ],
  },
  {
    id: "prd-3",
    product_code: "PRD-HRM-PULSE",
    product_name: "PEGATTO HRMS Pulse",
    description:
      "Unified human resource management suite providing real-time biometric time & attendance, compliant multi-tier payroll processing, leave balance tracking, and 360-degree performance appraisal workflows.",
    category: "HRMS",
    product_icon: "",
    icon_name: "hrms_pulse_icon.png",
    website_url: "https://pegatto.com/products/hrms-pulse",
    default_edition: "Standard",
    status: "Active",
    display_order: 3,
    editions_count: 3,
    editions: ["Essential", "Standard", "Enterprise"],
    modules_count: 5,
    modules: [
      "Employee Directory",
      "Attendance & Biometrics",
      "Payroll & Compliance",
      "Performance Reviews",
      "Recruitment ATS",
    ],
    region: "APAC",
    approval_status: "Approved",
    approval_notes:
      "Verified compliance with regional tax and labour statutory requirements.",
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-11-12T08:30:00Z",
    status_history: [
      {
        id: "sh-4",
        fromStatus: "Draft",
        toStatus: "Active",
        changedBy: "David Kim",
        userRole: "SuperAdmin",
        timestamp: "2026-03-20T10:00:00Z",
        reason: "Q1 product rollout launch",
      },
    ],
    audit_history: [
      {
        id: "ah-5",
        action: "CREATE",
        performedBy: "David Kim",
        userRole: "SuperAdmin",
        timestamp: "2026-03-20T10:00:00Z",
        details: "Created HRMS Pulse product master.",
        ipAddress: "192.168.1.15",
      },
    ],
  },
  {
    id: "prd-4",
    product_code: "PRD-ANL-INSIGHT",
    product_name: "PEGATTO Analytics & BI Cloud",
    description:
      "Deep data analytics engine delivering automated visualization, live streaming KPI dashboards, anomaly detection, cohort retention analyses, and custom SQL/drag-and-drop report builders.",
    category: "Analytics",
    product_icon: "",
    icon_name: "analytics_cloud_icon.png",
    website_url: "https://pegatto.com/products/analytics",
    default_edition: "Enterprise",
    status: "Active",
    display_order: 4,
    editions_count: 3,
    editions: ["Lite", "Pro", "Enterprise"],
    modules_count: 5,
    modules: [
      "Executive Dashboard",
      "Custom Query Builder",
      "Predictive Forecasting",
      "Scheduled Reports",
      "Data Connectors",
    ],
    region: "EMEA",
    approval_status: "Approved",
    approval_notes: "Verified cloud compute clustering capacity.",
    created_at: "2026-04-05T13:40:00Z",
    updated_at: "2026-11-17T11:20:00Z",
    status_history: [
      {
        id: "sh-5",
        fromStatus: "Draft",
        toStatus: "Active",
        changedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-04-05T13:40:00Z",
        reason: "Platform integration completed",
      },
    ],
    audit_history: [
      {
        id: "ah-6",
        action: "CREATE",
        performedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-04-05T13:40:00Z",
        details: "Initial setup of Analytics BI platform.",
        ipAddress: "10.0.0.1",
      },
    ],
  },
  {
    id: "prd-5",
    product_code: "PRD-FIN-LEDGER",
    product_name: "PEGATTO Smart Billing & Ledger",
    description:
      "Multi-entity recurring subscription billing engine with smart dunning, automated credit note handling, real-time tax calculation for 40+ countries, and direct bank reconciliation.",
    category: "Billing & Finance",
    product_icon: "",
    icon_name: "billing_ledger_icon.png",
    website_url: "https://pegatto.com/products/smart-billing",
    default_edition: "Professional",
    status: "Under Review",
    display_order: 5,
    editions_count: 2,
    editions: ["Standard", "Professional"],
    modules_count: 4,
    modules: [
      "Recurring Invoicing",
      "Gateway Connect",
      "Tax Calculation Engine",
      "Dispute Management",
    ],
    region: "Global",
    approval_status: "Pending Approval",
    approval_notes:
      "Pending final SuperAdmin sign-off on payment gateway SLA agreement.",
    created_at: "2026-10-01T15:00:00Z",
    updated_at: "2026-11-18T10:15:00Z",
    status_history: [
      {
        id: "sh-6",
        fromStatus: "Draft",
        toStatus: "Under Review",
        changedBy: "Elena Rostova",
        userRole: "Product Manager",
        timestamp: "2026-11-18T10:15:00Z",
        reason: "Submitted for SuperAdmin commercial approval",
      },
    ],
    audit_history: [
      {
        id: "ah-7",
        action: "APPROVAL_SUBMIT",
        performedBy: "Elena Rostova",
        userRole: "Product Manager",
        timestamp: "2026-11-18T10:15:00Z",
        details: "Submitted product for final approval.",
        ipAddress: "172.16.0.45",
      },
    ],
  },
  {
    id: "prd-6",
    product_code: "PRD-OPS-FLOW",
    product_name: "PEGATTO Operations Flow",
    description:
      "Project delivery and task coordination suite featuring interactive Gantt charts, sprint boards, resource utilization heatmaps, timesheet logging, and SLA milestone alerting.",
    category: "Operations",
    product_icon: "",
    icon_name: "ops_flow_icon.png",
    website_url: "https://pegatto.com/products/ops-flow",
    default_edition: "Standard",
    status: "Draft",
    display_order: 6,
    editions_count: 1,
    editions: ["Standard"],
    modules_count: 4,
    modules: [
      "Gantt Planner",
      "Kanban Sprints",
      "Resource Matrix",
      "Time Tracking",
    ],
    region: "LATAM",
    approval_status: "Draft",
    approval_notes: "Specification draft in progress by product team.",
    created_at: "2026-11-05T09:00:00Z",
    updated_at: "2026-11-18T09:00:00Z",
    status_history: [
      {
        id: "sh-7",
        fromStatus: "Draft",
        toStatus: "Draft",
        changedBy: "Marcus Brody",
        userRole: "Product Manager",
        timestamp: "2026-11-05T09:00:00Z",
        reason: "Initial blueprint creation",
      },
    ],
    audit_history: [
      {
        id: "ah-8",
        action: "CREATE",
        performedBy: "Marcus Brody",
        userRole: "Product Manager",
        timestamp: "2026-11-05T09:00:00Z",
        details: "Product master created in draft status.",
        ipAddress: "192.168.1.88",
      },
    ],
  },
  {
    id: "prd-7",
    product_code: "PRD-SEC-VAULT",
    product_name: "PEGATTO Security & Cloud Vault",
    description:
      "Enterprise encrypted cloud repository offering dedicated AES-256 partition isolation, immutable audit trails, biometric session validation, and multi-region replication.",
    category: "Cloud Infrastructure",
    product_icon: "",
    icon_name: "cloud_vault_icon.png",
    website_url: "https://pegatto.com/products/security-vault",
    default_edition: "Enterprise",
    status: "Inactive",
    display_order: 7,
    editions_count: 2,
    editions: ["Standard", "Enterprise"],
    modules_count: 4,
    modules: [
      "Encrypted S3 Drive",
      "Access Control Lists",
      "Key Rotation",
      "Disaster Backup",
    ],
    region: "North America",
    approval_status: "Approved",
    approval_notes:
      "Deactivated temporarily pending data center maintenance upgrade.",
    created_at: "2026-05-12T14:30:00Z",
    updated_at: "2026-11-01T12:00:00Z",
    status_history: [
      {
        id: "sh-8",
        fromStatus: "Active",
        toStatus: "Inactive",
        changedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-11-01T12:00:00Z",
        reason:
          "Maintenance window: migrating infrastructure to high-availability cluster",
      },
    ],
    audit_history: [
      {
        id: "ah-9",
        action: "DEACTIVATE",
        performedBy: "Alex Morgan",
        userRole: "SuperAdmin",
        timestamp: "2026-11-01T12:00:00Z",
        details:
          "Product deactivated by SuperAdmin. Reason: Maintenance window.",
        ipAddress: "10.0.0.1",
      },
    ],
  },
];

export const MOCK_COMPANY_DETAILS: CompanyDetailsRecord = {
  id: 1,
  company_name: "Pegatto Technologies Pvt Ltd",
  registration_no: "U72900TN2022PTC150000",
  email: "admin@pegatto.com",
  phone_number: "+91 98400 12345",
  website: "https://pegatto.com",
  currency: "INR",
  currency_format: "Rupees - ₹",
  timezone: "Asia/Kolkata (GMT+05:30)",
  fiscal_year_start: 4,
  date_format: "yyyy-MM-dd",
  company_logo: "pegatto-logo.png",
  address: {
    building_door_no: "Tower 4, 6th Floor",
    street_name: "OMR Cyber Corridor",
    area_name: "Thoraipakkam",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600097",
  },
  bank_details: {
    ifsc_code: "HDFC0001234",
    bank_name: "HDFC Bank",
    account_number: "50200012345678",
    account_type: "Current Account",
    swift_code: "HDFCINBB",
    branch: "Chennai OMR Branch",
    bank_address: "OMR Road, Thoraipakkam, Chennai - 600097",
  },
  business_hours: {
    start_time: "09:00",
    end_time: "18:00",
    working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
};

export const MOCK_ROLES: RoleRecord[] = [
  {
    id: 1,
    Role_Id: "ROL-001",
    Role_Name: "Super Admin",
    Role_Description:
      "Full platform root access, security control, tenant isolation, and billing authority",
    permissions: ["all"],
    Created_Date: "2026-01-10",
    user_count: 2,
    Is_Deleted: false,
  },
  {
    id: 2,
    Role_Id: "ROL-002",
    Role_Name: "Support Manager",
    Role_Description:
      "Manages support desks, ticket routing, and customer communication",
    permissions: ["tickets.manage", "users.view", "customers.view"],
    Created_Date: "2026-02-15",
    user_count: 5,
    Is_Deleted: false,
  },
  {
    id: 3,
    Role_Id: "ROL-003",
    Role_Name: "Billing Specialist",
    Role_Description:
      "Oversees invoices, subscriptions, payment receipts, and refunds",
    permissions: ["invoices.manage", "payments.manage", "plans.view"],
    Created_Date: "2026-03-01",
    user_count: 3,
    Is_Deleted: false,
  },
];

export const MOCK_USER_ADMINS: UserAdminRecord[] = [
  {
    id: 1,
    username: "superadmin",
    first_name: "Platform",
    last_name: "Administrator",
    email: "admin@pegatto.com",
    phone_number: "+91 98400 12345",
    role: "Super Admin",
    Role_Name: "Super Admin",
    is_active: true,
    Created_Date: "2026-01-10",
  },
  {
    id: 2,
    username: "sarah.jenkins",
    first_name: "Sarah",
    last_name: "Jenkins",
    email: "sarah.j@pegatto.com",
    phone_number: "+1 415-555-0199",
    role: "Support Manager",
    Role_Name: "Support Manager",
    is_active: true,
    Created_Date: "2026-02-15",
  },
  {
    id: 3,
    username: "alex.rivera",
    first_name: "Alex",
    last_name: "Rivera",
    email: "alex.r@pegatto.com",
    phone_number: "+1 415-555-0144",
    role: "Billing Specialist",
    Role_Name: "Billing Specialist",
    is_active: true,
    Created_Date: "2026-03-05",
  },
];

export const MOCK_STORAGE_MASTER: StorageMasterRecord[] = [
  {
    id: 1,
    Storage_Id: "STR-001",
    Name: "Cloud Storage Standard 50GB",
    Storage_Size: "50 GB",
    Price: 49,
    Country: "United States",
    Currency: "USD",
    Isactive: true,
    Is_Deleted: false,
    Created_Date: "2026-01-15",
  },
  {
    id: 2,
    Storage_Id: "STR-002",
    Name: "Cloud Storage Pro 100GB",
    Storage_Size: "100 GB",
    Price: 89,
    Country: "United States",
    Currency: "USD",
    Isactive: true,
    Is_Deleted: false,
    Created_Date: "2026-01-15",
  },
  {
    id: 3,
    Storage_Id: "STR-003",
    Name: "Enterprise Storage 500GB",
    Storage_Size: "500 GB",
    Price: 349,
    Country: "India",
    Currency: "INR",
    Isactive: true,
    Is_Deleted: false,
    Created_Date: "2026-02-10",
  },
  {
    id: 4,
    Storage_Id: "STR-004",
    Name: "Ultra Storage 1TB",
    Storage_Size: "1 TB",
    Price: 599,
    Country: "India",
    Currency: "INR",
    Isactive: true,
    Is_Deleted: false,
    Created_Date: "2026-02-10",
  },
];

export const MOCK_USER_MASTER: UserMasterRecord[] = [
  {
    id: 1,
    No_Of_Users: 5,
    Amount_Per_User: 12,
    Total_Amount: 60,
    Effective_Date: "2026-01-01",
    Status: "active",
    Currency_code: "USD",
    Country: "United States",
    Is_active: true,
    Is_Deleted: false,
  },
  {
    id: 2,
    No_Of_Users: 10,
    Amount_Per_User: 10,
    Total_Amount: 100,
    Effective_Date: "2026-02-01",
    Status: "active",
    Currency_code: "USD",
    Country: "United States",
    Is_active: true,
    Is_Deleted: false,
  },
  {
    id: 3,
    No_Of_Users: 25,
    Amount_Per_User: 8,
    Total_Amount: 200,
    Effective_Date: "2026-03-01",
    Status: "active",
    Currency_code: "INR",
    Country: "India",
    Is_active: true,
    Is_Deleted: false,
  },
];

export const MOCK_ADDON_MASTER: AddonMasterRecord[] = [
  {
    id: 1,
    Addon_Id: "ADD-001",
    Addon_Name: "AI Predictive Telemetry & Forecasts",
    Price: 199,
    NoofUsers: 10,
    Currency_code: "USD",
    Country: "United States",
    Started_Date: "2026-01-10",
    Is_Active: true,
    Is_Deleted: false,
  },
  {
    id: 2,
    Addon_Id: "ADD-002",
    Addon_Name: "Dedicated IP & SSL Gateway",
    Price: 99,
    NoofUsers: 5,
    Currency_code: "USD",
    Country: "United States",
    Started_Date: "2026-01-20",
    Is_Active: true,
    Is_Deleted: false,
  },
  {
    id: 3,
    Addon_Id: "ADD-003",
    Addon_Name: "Advanced Audit Trail & Compliance Vault",
    Price: 299,
    NoofUsers: 20,
    Currency_code: "INR",
    Country: "India",
    Started_Date: "2026-02-01",
    Is_Active: true,
    Is_Deleted: false,
  },
];

export const MOCK_SYSTEM_PREFERENCE: SystemPreferenceRecord = {
  id: 1,
  DateFormat: "yyyy-mm-dd",
  Password: "●●●●●●●●",
  ResetPassword: false,
  ForcePasswordChange: false,
  PasswordExpiryDays: 90,
  LoginValidityType: "DAYS",
  ValidFrom: "2026-01-01",
  ValidTo: "2026-12-31",
  LockAfterFailedAttempts: 5,
  hide_display_negative_sentiment: false,
  hide_display_inactive_leads: false,
  hide_display_inactive_users: false,
};

// ----------------------------------------------------------------------
// RTK QUERY ENDPOINTS DEFINITION
// ----------------------------------------------------------------------

export const superAdminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // SuperAdmin Overview endpoints
    getSubscriptionAnalytics: builder.query<SubscriptionAnalyticsData, void>({
      query: () => "superadmin/SubscriptionAnalyticsAPI/",
      transformResponse: (res: any) =>
        res?.data || res || MOCK_SUBSCRIPTION_ANALYTICS,
      providesTags: ["SuperAdmin"],
    }),
    getSubscriptionInsights: builder.query<SubscriptionInsightsData, void>({
      query: () => "superadmin/SubscriptionInsightsAPI/",
      transformResponse: (res: any) =>
        res?.data || res || MOCK_SUBSCRIPTION_INSIGHTS,
      providesTags: ["SuperAdmin"],
    }),
    getUsageAnalytics: builder.query<UsageAnalyticsData, void>({
      query: () => "superadmin/UsageAnalyticsAPI/",
      transformResponse: (res: any) => res?.data || res || MOCK_USAGE_ANALYTICS,
      providesTags: ["SuperAdmin"],
    }),
    getInstanceAnalytics: builder.query<InstanceAnalyticsData, void>({
      query: () => "superadmin/InstanceAnalyticsAPI/",
      transformResponse: (res: any) =>
        res?.data || res || MOCK_INSTANCE_ANALYTICS,
      providesTags: ["SuperAdmin"],
    }),

    // Analytics Dashboard endpoints
    getRevenueForecastDashboard: builder.query<RevenueForecastData, void>({
      query: () => "superadmin/RevenueForecastDashboard/",
      transformResponse: (res: any) =>
        res?.data || res || MOCK_REVENUE_FORECAST,
      providesTags: ["SuperAdmin"],
    }),
    getPaymentDashboardAnalytics: builder.query<PaymentHighlightsData, void>({
      query: () => "superadmin/PaymentDashboardAnalytics/",
      transformResponse: (res: any) =>
        res?.data || res || MOCK_PAYMENT_HIGHLIGHTS,
      providesTags: ["SuperAdmin"],
    }),
    getRenewalDashboardAnalytics: builder.query<RenewalAnalyticsData, void>({
      query: () => "superadmin/RenewalDashboardAnalytics/",
      transformResponse: (res: any) =>
        res?.data || res || MOCK_RENEWAL_ANALYTICS,
      providesTags: ["SuperAdmin"],
    }),
    getRenewalFunnelAnalytics: builder.query<RenewalFunnelData, void>({
      query: () => "superadmin/RenewalFunnelAnalytics/",
      transformResponse: (res: any) => res?.data || res || MOCK_RENEWAL_FUNNEL,
      providesTags: ["SuperAdmin"],
    }),
    getCancellationOverviewAnalytics: builder.query<
      CancellationAnalyticsData,
      void
    >({
      query: () => "superadmin/CancellationOverviewAnalytics/",
      transformResponse: (res: any) =>
        res?.data || res || MOCK_CANCELLATION_ANALYTICS,
      providesTags: ["SuperAdmin"],
    }),
    getPlanAdoptionDashboardAnalytics: builder.query<PlanAdoptionData, void>({
      query: () => "superadmin/PlanAdoptionDashboardAnalytics/",
      transformResponse: (res: any) => res?.data || res || MOCK_PLAN_ADOPTION,
      providesTags: ["SuperAdmin"],
    }),
    getTopPlansDistributionAnalytics: builder.query<TopPlansData, void>({
      query: () => "superadmin/TopPlansDistributionAnalytics/",
      transformResponse: (res: any) => res?.data || res || MOCK_TOP_PLANS,
      providesTags: ["SuperAdmin"],
    }),
    getRequestOperationsDashboard: builder.query<RequestDistributionData, void>(
      {
        query: () => "superadmin/RequestOperationsDashboard/",
        transformResponse: (res: any) =>
          res?.data || res || MOCK_REQUEST_DISTRIBUTION,
        providesTags: ["SuperAdmin"],
      },
    ),

    // Customer Master KPI Metrics and Charts Analytics
    getCustomerKpiAnalytics: builder.query<
      CustomerKpiData,
      { product?: string } | void
    >({
      query: (params) => {
        const product = params && params.product ? params.product.trim() : "";
        const queryParam =
          product && product !== "All Products"
            ? `?product=${encodeURIComponent(product)}`
            : "";
        return `superadmin/CustomerKpiAnalyticsAPI/${queryParam}`;
      },
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["Accounts"],
    }),

    // Customer Overview Live Analytics & Charts Endpoint
    getCustomerOverviewAnalytics: builder.query<
      CustomerOverviewAnalyticsData,
      { customerId?: string } | void
    >({
      query: (params) => {
        const customerId = params?.customerId?.trim() || "";
        const queryParam = customerId
          ? `?customer_id=${encodeURIComponent(customerId)}`
          : "";
        return `superadmin/CustomerOverviewAnalytics/${queryParam}`;
      },
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["Accounts"],
    }),

    // Customer Activity & Audit History endpoint (calls AuditHistoryFilter when filters applied, or AuditHistoryList for all)
    getCustomerAuditHistory: builder.query<
      CustomerAuditHistoryRecord[],
      { recordId?: string; action?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("Table_Name", "Account");

        const hasFilter = Boolean(
          (params?.recordId && params.recordId !== "ALL") ||
          (params?.action && params.action !== "ALL") ||
          (params?.search && params.search.trim().length > 0),
        );

        if (params?.recordId && params.recordId !== "ALL") {
          queryParams.append("Record_Id", params.recordId);
        }
        if (params?.action && params.action !== "ALL") {
          queryParams.append("Action", params.action);
        }
        if (params?.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }

        const endpoint = hasFilter
          ? "superadmin/AuditHistoryFilter/"
          : "superadmin/AuditHistoryList/";
        return `${endpoint}?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : raw?.results ? raw.results : [];
      },
      providesTags: ["Accounts"],
    }),

    // Customer Documents endpoints
    getCustomerDocumentList: builder.query<
      DocumentMasterRecord[],
      { accountId?: string; fileType?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.accountId && params.accountId !== "ALL") {
          queryParams.append("Account_Id", params.accountId);
        }
        if (params?.fileType && params.fileType !== "ALL") {
          queryParams.append("File_Type", params.fileType);
        }
        if (params?.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }
        return `superadmin/DocumentMasterFilter/?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : raw?.results ? raw.results : [];
      },
      providesTags: ["Accounts"],
    }),

    uploadCustomerDocument: builder.mutation<
      any,
      | FormData
      | {
          Account_Id: string | number;
          FileName: string;
          File: string;
          Description?: string;
          File_Type?: string;
        }
    >({
      query: (body) => ({
        url: "superadmin/DocumentMasterCRUD/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounts"],
    }),

    deleteCustomerDocument: builder.mutation<any, { id: string | number }>({
      query: (params) => ({
        url: `superadmin/DocumentMasterCRUD/?id=${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Accounts"],
    }),

    // Dedicated filter endpoint for Customer Audit History
    filterCustomerAuditHistory: builder.query<
      CustomerAuditHistoryRecord[],
      { recordId?: string; action?: string; search?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("Table_Name", "Account");
        if (params.recordId && params.recordId !== "ALL") {
          queryParams.append("Record_Id", params.recordId);
        }
        if (params.action && params.action !== "ALL") {
          queryParams.append("Action", params.action);
        }
        if (params.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }
        return `superadmin/AuditHistoryFilter/?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : raw?.results ? raw.results : [];
      },
      providesTags: ["Accounts"],
    }),

    // Account Menu Endpoints (Customer / Tenant)
    getAccountsList: builder.query<
      AccountRecord[],
      { product?: string; search?: string; page?: number } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("Is_Deleted", "False");
        if (params?.product && params.product !== "All Products") {
          queryParams.append("Primary_Product", params.product);
          queryParams.append("Product", params.product);
        }
        if (params?.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }
        if (params?.page) {
          queryParams.append("page", String(params.page));
        }
        return `superadmin/AccountAdditional/?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : raw?.results ? raw.results : [];
      },
      providesTags: ["Accounts"],
    }),

    getAccountsPaginatedList: builder.query<
      {
        count: number;
        next: string | null;
        previous: string | null;
        results: AccountRecord[];
      },
      { page?: number; product?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("Is_Deleted", "False");
        queryParams.append("page", String(params?.page && params.page > 0 ? params.page : 1));
        if (params?.product && params.product !== "All Products") {
          queryParams.append("Primary_Product", params.product);
          queryParams.append("Product", params.product);
        }
        if (params?.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }
        return `superadmin/AccountAdditional/?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => {
        if (Array.isArray(res)) {
          return { count: res.length, next: null, previous: null, results: res };
        }
        const results = Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res?.data)
          ? res.data
          : [];
        return {
          count: typeof res?.count === "number" ? res.count : results.length,
          next: res?.next ?? null,
          previous: res?.previous ?? null,
          results,
        };
      },
      providesTags: ["Accounts"],
    }),

    searchAccounts: builder.query<AccountRecord[], string>({
      query: (search) =>
        `superadmin/CustomerAccountSearch/?search=${encodeURIComponent(search)}`,
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : raw?.results ? raw.results : [];
      },
      providesTags: ["Accounts"],
    }),

    searchCustomerAccountsPaginated: builder.query<
      {
        count: number;
        next: string | null;
        previous: string | null;
        results: AccountRecord[];
      },
      { search: string; page?: number }
    >({
      query: ({ search, page = 1 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append("search", search.trim());
        queryParams.append("page", String(page > 0 ? page : 1));
        return `superadmin/CustomerAccountSearch/?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => {
        if (Array.isArray(res)) {
          return { count: res.length, next: null, previous: null, results: res };
        }
        const results = Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res?.data)
          ? res.data
          : [];
        return {
          count: typeof res?.count === "number" ? res.count : results.length,
          next: res?.next ?? null,
          previous: res?.previous ?? null,
          results,
        };
      },
      providesTags: ["Accounts"],
    }),

    filterAccounts: builder.query<AccountRecord[], Record<string, any>>({
      query: (filterParams) => {
        const queryParams = new URLSearchParams();
        queryParams.append("Is_Deleted", "False");
        Object.entries(filterParams).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") {
            queryParams.append(k, String(v));
          }
        });
        return `superadmin/AccountFilter/?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : raw?.results ? raw.results : [];
      },
      providesTags: ["Accounts"],
    }),

    createAccount: builder.mutation<any, Partial<AccountRecord>>({
      query: (payload) => ({
        url: "superadmin/AccountCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Accounts"],
    }),
    updateAccount: builder.mutation<any, Partial<AccountRecord>>({
      query: (payload) => ({
        url: "superadmin/AccountCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Accounts"],
    }),
    deleteAccount: builder.mutation<
      any,
      { id: string | number; Account_Id?: string | number }
    >({
      query: ({ id, Account_Id }) => ({
        url: `superadmin/AccountCRUD/?id=${id}`,
        method: "DELETE",
        body: { id, Account_Id: Account_Id || id },
      }),
      invalidatesTags: ["Accounts"],
    }),

    // Sales Module - Plans Endpoints
    getPlansList: builder.query<
      PlanRecord[],
      {
        Product?: string | number;
        Plantype?: string;
        status?: string;
        search?: string;
      } | void
    >({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params?.Product !== undefined && String(params.Product).trim() && String(params.Product) !== "ALL") {
          sp.set("Product", String(params.Product));
        }
        if (params?.Plantype && params.Plantype !== "All") {
          sp.set("Plantype", params.Plantype);
        }
        if (params?.status && params.status !== "All") {
          sp.set("status", params.status);
        }
        if (params?.search?.trim()) {
          sp.set("search", params.search.trim());
        }
        const qs = sp.toString();
        return `superadmin/planCRUD/${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        const list = Array.isArray(raw) ? raw : [];
        return list.map((item: any) => ({
          ...item,
          id: item.id ?? item.Plan_Id,
          name: item.name || item.Plan_Name || item.planname || "Unnamed Plan",
          Plan_Name: item.Plan_Name || item.name || "Unnamed Plan",
          code: item.Plan_Code || item.code || item.Plan_Id || `PLAN-${item.id}`,
          Plan_Id: item.Plan_Id || item.code || `PLAN-${item.id}`,
          Producttype: item.Product_name || item.Producttype || item.Product || "SuperAdmin Cloud",
          Product_id: item.Product_id ?? null,
          Product_code: item.Product_code ?? null,
          plantype: item.plantype || item.Plantype || (item.is_free ? "Free" : "Paid"),
          price:
            item.price !== undefined
              ? item.price
              : item.Planmonth_price ?? item.UnitPrice ?? 0,
          monthly_price:
            item.monthly_price !== undefined
              ? item.monthly_price
              : item.Planmonth_price ?? item.UnitPrice ?? 0,
          yearly_price:
            item.yearly_price !== undefined
              ? item.yearly_price
              : item.Planyear_price ?? 0,
          currency: item.currency || item.Currency_Type || "INR",
          noofuser: item.noofuser ?? item.No_Of_Users ?? 10,
          max_users: item.max_users ?? item.No_Of_Users ?? 10,
          noofcontact: item.noofcontact ?? item.Noofcontacts ?? 0,
          storage: item.storage ?? item.AllocatedStorage ?? 50,
          max_storage_gb: item.max_storage_gb ?? item.AllocatedStorage ?? 50,
          trailperiod:
            item.trailperiod !== undefined
              ? item.trailperiod
              : item.Trialperiod ?? 0,
          billing_cycle:
            item.billing_cycle || (item.Plan_per_month ? "monthly" : "yearly"),
          description:
            item.description || item.PlanDetails || item.Description || "",
          is_active:
            item.is_active !== undefined
              ? item.is_active
              : item.Is_Active_Flg !== false,
          features: Array.isArray(item.features) ? item.features : [],
          limits: Array.isArray(item.limits) ? item.limits : [],
        }));
      },
      providesTags: ["Plans"],
    }),
    filterPlans: builder.query<
      PlanRecord[],
      {
        Product?: string | number;
        Plantype?: string;
        status?: string;
        billing_cycle?: string;
        Currency_Type?: string;
        search?: string;
      }
    >({
      query: (body) => ({
        url: "superadmin/PlanFilter/",
        method: "POST",
        body,
      }),
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["Plans"],
    }),
    getPlanComparisonMatrix: builder.query<
      {
        status: boolean;
        product: string;
        product_id: number | null;
        plans: any[];
        catalog_features: any[];
        features_matrix: Array<{
          feature_name: string;
          feature_id: number | null;
          cells: Record<string, { included: boolean; price: number; plan_feature_id: number | null }>;
        }>;
        usage_limits: Array<{
          id: number;
          PlanLimit_Id: string;
          Plan_Id: number;
          Plan_Name: string | null;
          Limit_Name: string;
          Limit_Code: string;
          Limit_Value: number | null;
          Unit: string | null;
          Is_Unlimited: boolean;
        }>;
      },
      { product?: string | number; Plantype?: string; status?: string; search?: string } | void
    >({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params?.product && String(params.product) !== "ALL") {
          sp.set("product", String(params.product));
        }
        if (params?.Plantype && params.Plantype !== "All") {
          sp.set("Plantype", params.Plantype);
        }
        if (params?.status && params.status !== "All") {
          sp.set("status", params.status);
        }
        if (params?.search?.trim()) {
          sp.set("search", params.search.trim());
        }
        const qs = sp.toString();
        return `superadmin/PlanComparisonMatrix/${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Plans"],
    }),
    mutatePlanComparisonMatrix: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: "superadmin/PlanComparisonMatrix/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Plans"],
    }),
    publishPlans: builder.mutation<
      { status: boolean; published_count: number; published_plan_ids: number[]; message: string },
      { product?: string | number; plan_ids?: number[] }
    >({
      query: (payload) => ({
        url: "superadmin/PlanPublish/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Plans"],
    }),
    getProductConfigurations: builder.query<any[], { product?: string | number } | void>({
      query: (params) => {
        const q = params?.product && String(params.product) !== "ALL"
          ? `?product=${encodeURIComponent(String(params.product))}`
          : "";
        return `superadmin/ProductConfigurationlistwithoutpaginaton/${q}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["ProductMasters", "Plans"],
    }),
    getPlanLimitsList: builder.query<any[], { planId?: string | number } | void>({
      query: (params) => {
        const q = params?.planId ? `?Plan_Id=${encodeURIComponent(String(params.planId))}` : "";
        return `superadmin/PlanLimitlistwithoutpaginaton/${q}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["Plans"],
    }),
    getProductFeaturesList: builder.query<any[], { product?: string | number } | void>({
      query: (params) => {
        const q = params?.product && String(params.product) !== "ALL"
          ? `?product=${encodeURIComponent(String(params.product))}`
          : "";
        return `superadmin/ProductFeaturelistwithoutpaginaton/${q}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["Plans", "ProductMasters"],
    }),
    saveProductConfiguration: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: "superadmin/ProductConfigurationCRUD/",
        method: payload.id ? "PATCH" : "POST",
        body: payload,
      }),
      invalidatesTags: ["ProductMasters", "Plans"],
    }),
    // Product Pricing Endpoints
    getProductPricingList: builder.query<any[], Record<string, any> | void>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && String(v).trim() && !String(v).startsWith("All")) {
              sp.set(k, String(v));
            }
          });
        }
        const qs = sp.toString();
        return `superadmin/ProductPricingCRUD/${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["Plans"],
    }),
    getProductPricingKpi: builder.query<any, void>({
      query: () => "superadmin/ProductPricingKPI/",
      providesTags: ["Plans"],
    }),
    getProductPriceMatrix: builder.query<any[], Record<string, any> | void>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params?.Product && params.Product !== "All") sp.set("Product", String(params.Product));
        const qs = sp.toString();
        return `superadmin/ProductPriceMatrix/${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: any) => (Array.isArray(res?.results) ? res.results : []),
      providesTags: ["Plans"],
    }),
    getProductPriceHistory: builder.query<any[], { Pricing_Id?: string } | void>({
      query: (params) =>
        params?.Pricing_Id
          ? `superadmin/ProductPriceHistory/?Pricing_Id=${encodeURIComponent(params.Pricing_Id)}`
          : "superadmin/ProductPriceHistory/",
      transformResponse: (res: any) => (Array.isArray(res?.results) ? res.results : []),
      providesTags: ["Plans"],
    }),
    getProductEditionsList: builder.query<any[], { product?: string | number } | void>({
      query: (params) =>
        params?.product && params.product !== "All"
          ? `superadmin/ProductEditionlistwithoutpaginaton/?product=${encodeURIComponent(String(params.product))}`
          : "superadmin/ProductEditionlistwithoutpaginaton/",
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["ProductMasters"],
    }),
    createProductPricing: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: "superadmin/ProductPricingCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Plans"],
    }),
    updateProductPricing: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: "superadmin/ProductPricingCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Plans"],
    }),
    deleteProductPricing: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/ProductPricingCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),
    bulkUpdateProductPricing: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: "superadmin/ProductPricingBulkUpdate/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Plans"],
    }),
    scheduleProductPricing: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: "superadmin/ProductPricingSchedule/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Plans"],
    }),
    createPlan: builder.mutation<any, Partial<PlanRecord>>({
      query: (payload) => ({
        url: "superadmin/planCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Plans"],
    }),
    updatePlan: builder.mutation<any, Partial<PlanRecord>>({
      query: (payload) => ({
        url: "superadmin/planCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Plans"],
    }),
    deletePlan: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/planCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),

    // Sales Module - Subscriptions Endpoints
    getSubscriptionsList: builder.query<
      SubscriptionRecord[],
      { customerId?: string } | void
    >({
      query: (params) => {
        const cid = params?.customerId
          ? `&customer_id=${encodeURIComponent(params.customerId)}`
          : "";
        return `superadmin/subscriptionlist/?page=1${cid}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        const list =
          Array.isArray(raw) && raw.length > 0 ? raw : MOCK_SUBSCRIPTIONS;
        return list.map((item: any) => ({
          ...item,
          id: item.id || item.Subscription_Id,
          Subscription_Id: item.Subscription_Id || `SUB-${item.id}`,
          Subscription_Name:
            item.Subscription_Name || item.Customer_Name
              ? `${item.Customer_Name || "Tenant"} Subscription`
              : "Enterprise Subscription",
          Customer_Id:
            typeof item.Customer_Id === "object"
              ? item.Customer_Id?.id
              : item.Customer_Id,
          Customer_Name:
            typeof item.Customer_Id === "object"
              ? item.Customer_Id?.Organization_Name
              : item.Customer_Name || "Valued Customer",
          Plan_Id:
            typeof item.Plan_Id === "object" ? item.Plan_Id?.id : item.Plan_Id,
          Plan_Name:
            typeof item.Plan_Id === "object"
              ? item.Plan_Id?.Plan_Name
              : item.Plan_Name || "Cloud Plan",
          No_Of_Users: item.No_Of_Users || item.Base_Users || 10,
          Base_Users: item.Base_Users || item.No_Of_Users || 10,
          UnitPrice: item.UnitPrice || 0,
          SuscriptionAmount: item.SuscriptionAmount || item.Amount || 0,
          TaxAmount: item.TaxAmount || 0,
          discount: item.discount || 0,
          start_date:
            item.start_date ||
            item.SubscriptionDate ||
            item.Created_Date ||
            "2026-01-01",
          end_date: item.end_date || "2027-01-01",
          status:
            item.status || (item.SubInvoicePaidFlag ? "active" : "pending"),
          Basestorage_Size: item.Basestorage_Size || 100,
          auto_renew: item.auto_renew !== false,
        }));
      },
      providesTags: ["Subscriptions"],
    }),
    createSubscription: builder.mutation<any, Partial<SubscriptionRecord>>({
      query: (payload) => ({
        url: "superadmin/subscription/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    updateSubscription: builder.mutation<any, Partial<SubscriptionRecord>>({
      query: (payload) => ({
        url: "superadmin/subscription/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    deleteSubscription: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/subscription/?id=${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    // Sales Module - Invoices Endpoints
    getInvoicesList: builder.query<InvoiceRecord[], void>({
      query: () =>
        "superadmin/InvoiceDetailsAdditional/?Is_Deleted=False&page=1",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["Invoices"],
    }),
    getInvoiceFullList: builder.query<
      InvoiceRecord[],
      { customerId?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.customerId && params.customerId !== "ALL") {
          queryParams.append("customer_id", params.customerId);
        }
        if (params?.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }
        const qs = queryParams.toString();
        return qs
          ? `superadmin/InvoiceFullList/?${qs}`
          : "superadmin/InvoiceFullList/";
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        if (!Array.isArray(raw)) return [];
        return raw.map((inv: any) => ({
          ...inv,
          Customer_Name:
            inv.Customer_Name ||
            inv.Customer_Id?.Organization_Name ||
            inv.Customer_Id?.name ||
            (typeof inv.Customer_Id === "string" ? inv.Customer_Id : "—"),
          Subscription_Name:
            inv.Subscription_Name ||
            inv.Subscription_Id?.Plan_Name ||
            inv.Subscription_Id?.Subscription_Name ||
            inv.InvoiceFor ||
            "Standard",
        }));
      },
      providesTags: ["Invoices"],
    }),
    createInvoice: builder.mutation<any, Partial<InvoiceRecord>>({
      query: (payload) => ({
        url: "superadmin/Invoice/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Invoices"],
    }),
    updateInvoice: builder.mutation<any, Partial<InvoiceRecord>>({
      query: (payload) => ({
        url: "superadmin/Invoice/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Invoices"],
    }),

    // Sales Module - Payments Endpoints
    getPaymentsList: builder.query<PaymentRecord[], void>({
      query: () => "superadmin/PaymentsAdditional/?page=1",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["Payments"],
    }),
    getPaymentsFullList: builder.query<PaymentRecord[], void>({
      query: () => "superadmin/PaymentsFullList/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["Payments"],
    }),
    createPayment: builder.mutation<any, Partial<PaymentRecord>>({
      query: (payload) => ({
        url: "superadmin/Paymentdetails/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Payments", "Invoices"],
    }),
    deletePayment: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/Paymentdetails/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments", "Invoices"],
    }),

    // Sales Module - Instance Request Endpoints
    getInstanceRequestsList: builder.query<InstanceRequestRecord[], void>({
      query: () => "superadmin/InstanceRequestlist/?page=1",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0
          ? raw
          : MOCK_INSTANCE_REQUESTS;
      },
      providesTags: ["InstanceRequests"],
    }),
    createInstanceRequest: builder.mutation<
      any,
      Partial<InstanceRequestRecord>
    >({
      query: (payload) => ({
        url: "superadmin/InstanceRequest/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["InstanceRequests"],
    }),
    updateInstanceRequest: builder.mutation<
      any,
      Partial<InstanceRequestRecord>
    >({
      query: (payload) => ({
        url: "superadmin/InstanceRequest/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["InstanceRequests"],
    }),
    deleteInstanceRequest: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/InstanceRequest/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InstanceRequests"],
    }),

    // Sales Module - Instance Creation Endpoints
    getPendingInstanceRequests: builder.query<InstanceRequestRecord[], void>({
      query: () => "superadmin/InstanceRequestpendingList/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0
          ? raw
          : MOCK_INSTANCE_REQUESTS.filter((r) => !r.InstanceCreatedFlag);
      },
      providesTags: ["InstanceCreations", "InstanceRequests"],
    }),
    getProvisionedInstances: builder.query<InstanceCreationRecord[], void>({
      query: () => "superadmin/InstanceCreationList/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0
          ? raw
          : MOCK_INSTANCE_CREATIONS;
      },
      providesTags: ["InstanceCreations"],
    }),
    createProvisionedInstance: builder.mutation<
      any,
      Partial<InstanceCreationRecord>
    >({
      query: (payload) => ({
        url: "superadmin/InstanceCreationtCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["InstanceCreations", "InstanceRequests"],
    }),

    // Customer Management - Additional License Requests
    getAdditionalLicenseList: builder.query<AdditionalLicenseRecord[], void>({
      query: () => "superadmin/Additionallicenserequestlist/?page=1",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["AdditionalLicenses"],
    }),
    createAdditionalLicense: builder.mutation<
      any,
      Partial<AdditionalLicenseRecord>
    >({
      query: (payload) => ({
        url: "superadmin/Additionallicenserequest/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AdditionalLicenses", "Subscriptions"],
    }),
    updateAdditionalLicense: builder.mutation<
      any,
      Partial<AdditionalLicenseRecord>
    >({
      query: (payload) => ({
        url: "superadmin/Additionallicenserequest/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AdditionalLicenses", "Subscriptions"],
    }),
    deleteAdditionalLicense: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/AddorcancellicenseCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdditionalLicenses"],
    }),

    // Customer Management - Addon Subscription Requests
    getAddonSubscriptionList: builder.query<AddonSubscriptionRecord[], void>({
      query: () => "superadmin/Addsubscriptionrequestlist/?page=1",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["AddonSubscriptions"],
    }),
    createAddonSubscription: builder.mutation<
      any,
      Partial<AddonSubscriptionRecord>
    >({
      query: (payload) => ({
        url: "superadmin/Addsubscriptionrequest/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AddonSubscriptions", "Subscriptions"],
    }),
    updateAddonSubscription: builder.mutation<
      any,
      Partial<AddonSubscriptionRecord>
    >({
      query: (payload) => ({
        url: "superadmin/AdditionalAddonUpdate/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AddonSubscriptions", "Subscriptions"],
    }),
    deleteAddonSubscription: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/addonsubscription/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AddonSubscriptions"],
    }),

    // Customer Management - Additional Storage Requests
    getAdditionalStorageList: builder.query<AdditionalStorageRecord[], void>({
      query: () => "superadmin/Additionalstoragerequestlist/?page=1",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["AdditionalStorages"],
    }),
    createAdditionalStorage: builder.mutation<
      any,
      Partial<AdditionalStorageRecord>
    >({
      query: (payload) => ({
        url: "superadmin/Additionalstoragerequest/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AdditionalStorages", "Subscriptions"],
    }),
    updateAdditionalStorage: builder.mutation<
      any,
      Partial<AdditionalStorageRecord>
    >({
      query: (payload) => ({
        url: "superadmin/AdditionalStorageUpdate/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AdditionalStorages", "Subscriptions"],
    }),
    deleteAdditionalStorage: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/AddStorageCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdditionalStorages"],
    }),

    // Customer Management - Renewal Due Requests
    getRenewalDueList: builder.query<
      RenewalDueRecord[],
      {
        customerId?: string;
        status?: string;
        search?: string;
        page?: number;
      } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.customerId && params.customerId !== "ALL") {
          queryParams.append("customer_id", params.customerId);
        }
        if (params?.status && params.status !== "ALL") {
          queryParams.append("status", params.status);
        }
        if (params?.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }
        const qs = queryParams.toString();
        return `superadmin/renewallist/${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : raw?.results ? raw.results : [];
      },
      providesTags: ["RenewalDues"],
    }),
    createRenewal: builder.mutation<any, Partial<RenewalDueRecord>>({
      query: (payload) => ({
        url: "superadmin/renewalCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["RenewalDues", "Subscriptions"],
    }),
    updateRenewal: builder.mutation<any, Partial<RenewalDueRecord>>({
      query: (payload) => ({
        url: "superadmin/renewalCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["RenewalDues", "Subscriptions"],
    }),
    deleteRenewal: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/renewalCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RenewalDues"],
    }),

    // Customer Management - Cancel Plan Requests
    getCancelPlanList: builder.query<CancelPlanRecord[], void>({
      query: () => "superadmin/CancelPlanlist/?page=1",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["CancelPlans"],
    }),
    createCancelPlan: builder.mutation<any, Partial<CancelPlanRecord>>({
      query: (payload) => ({
        url: "superadmin/CancelPlanPost/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CancelPlans", "Subscriptions"],
    }),
    deleteCancelPlan: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/CancelPlanCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CancelPlans"],
    }),

    // Dropdowns & Lookups
    getProductDropdown: builder.query<
      Array<{ id: string | number; name: string }>,
      void
    >({
      query: () => "superadmin/ProductDropdownAPI/",
      transformResponse: (res: any) => {
        const raw = res?.data || res;
        return Array.isArray(raw) && raw.length > 0
          ? raw
          : [
              { id: "1", name: "SuperAdmin Cloud" },
              { id: "2", name: "CRM Enterprise" },
              { id: "3", name: "ERP Core" },
              { id: "4", name: "Analytics Pro" },
            ];
      },
    }),
    getMenuList: builder.query<
      Array<{ id: string | number; title: string; category?: string }>,
      void
    >({
      query: () => "auth/MenuWithoutPagination/",
      transformResponse: (res: any) => {
        const raw = res?.data || res;
        return Array.isArray(raw) && raw.length > 0
          ? raw
          : [
              { id: "1", title: "Dashboard & Telemetry", category: "Overview" },
              {
                id: "2",
                title: "Customer & Tenant Admin",
                category: "Customer",
              },
              { id: "3", title: "Subscription Management", category: "Sales" },
              {
                id: "4",
                title: "Analytics & Revenue Reports",
                category: "Analytics",
              },
              {
                id: "5",
                title: "Role & Permission Matrix",
                category: "Settings",
              },
              { id: "6", title: "Defect & Ticket Desk", category: "Support" },
            ];
      },
    }),
    getIndustryList: builder.query<
      Array<{ id: string | number; label: string }>,
      void
    >({
      query: () => "useradmin/Userlookuplist/",
      transformResponse: (res: any) => {
        const raw = res?.data || res;
        if (Array.isArray(raw)) {
          const industryObj = raw.find(
            (item: any) => item?.Lookupname === "Industry Type",
          );
          if (industryObj?.Values && Array.isArray(industryObj.Values)) {
            return industryObj.Values.map((v: any, idx: number) => ({
              id: String(v.id || idx),
              label: v.value || v.label || String(v),
            }));
          }
          if (raw.length > 0 && (raw[0].label || raw[0].name || raw[0].value)) {
            return raw.map((r: any, idx: number) => ({
              id: String(r.id || idx),
              label: r.label || r.name || r.value,
            }));
          }
        }
        return [
          { id: "ind-1", label: "Information Technology & SaaS" },
          { id: "ind-2", label: "Financial Services & Banking" },
          { id: "ind-3", label: "Healthcare & Life Sciences" },
          { id: "ind-4", label: "Supply Chain & Manufacturing" },
          { id: "ind-5", label: "E-commerce & Retail" },
        ];
      },
    }),
    getAddonList: builder.query<
      Array<{
        id: string | number;
        name?: string;
        addon_name?: string;
        price?: number;
      }>,
      void
    >({
      query: () => "superadmin/AddonListAPI/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0
          ? raw
          : [
              { id: "1", addon_name: "Advanced Analytics Addon", price: 49 },
              { id: "2", addon_name: "Custom Domain SSL", price: 19 },
              { id: "3", addon_name: "Dedicated Cloud Database", price: 99 },
              { id: "4", addon_name: "24/7 Priority Support SLA", price: 79 },
            ];
      },
    }),
    getAccountFullList: builder.query<
      AccountRecord[],
      { customerId?: string } | void
    >({
      query: (params) => {
        const cid = params?.customerId
          ? `&customer_id=${encodeURIComponent(params.customerId)}`
          : "";
        return `superadmin/AccountFullList/?Is_Deleted=False${cid}`;
      },
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : raw?.results ? raw.results : [];
      },
      providesTags: ["Accounts"],
    }),

    getAccountById: builder.query<AccountRecord, string | number>({
      query: (id) => `superadmin/AccountCRUD/?Account_Id=${id}`,
      transformResponse: (res: any) => res?.data || res,
      providesTags: (_res, _err, id) => [{ type: "Accounts", id }],
    }),

    getPlanById: builder.query<PlanRecord, string | number>({
      query: (id) => `superadmin/planCRUD/?id=${id}`,
      transformResponse: (res: any) => {
        return res?.data || res || null;
      },
      providesTags: ["Plans"],
    }),

    // Task Management Endpoints
    getTasksList: builder.query<TaskRecord[], void>({
      query: () => "user/NewTaskManagemntAdditional/?Is_Deleted=False",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0 ? raw : MOCK_TASKS;
      },
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation<any, Partial<TaskRecord>>({
      query: (payload) => ({
        url: "user/NewTaskManagemntCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation<any, Partial<TaskRecord>>({
      query: (payload) => ({
        url: "user/NewTaskManagemntCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `user/NewTaskManagemntCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    getProjectsList: builder.query<
      Array<{ id: string | number; name: string }>,
      void
    >({
      query: () => "user/ProjectAdditional/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0
          ? raw
          : [
              { id: "1", name: "Infrastructure Scaling" },
              { id: "2", name: "Security & Compliance" },
              { id: "3", name: "Sales Billing Module" },
              { id: "4", name: "Customer Support Portal" },
            ];
      },
    }),

    // Ticket Management Groups
    getTicketGroupsList: builder.query<TicketGroupRecord[], void>({
      query: () => "superadmin/SuperAdminTicketManagement/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        if (Array.isArray(raw) && raw.length > 0) {
          return raw.map((item: any) => {
            const assign = Array.isArray(item.AssigntoUser)
              ? item.AssigntoUser.map((u: any) => u.Employee || u.username || u)
              : typeof item.Members === "string"
                ? item.Members.split(",")
                : Array.isArray(item.Members)
                  ? item.Members
                  : [];
            return {
              id: item.id,
              Related_to: item.TicketRelatesto || item.Related_to || "",
              TicketRelatesto: item.TicketRelatesto || item.Related_to || "",
              Members: assign,
              allow: false,
            };
          });
        }
        return MOCK_TICKET_GROUPS;
      },
      providesTags: ["TicketGroups"],
    }),
    createTicketGroup: builder.mutation<any, Partial<TicketGroupRecord>>({
      query: (payload) => ({
        url: "superadmin/SuperAdminTicketManagementCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TicketGroups"],
    }),
    updateTicketGroup: builder.mutation<any, Partial<TicketGroupRecord>>({
      query: (payload) => ({
        url: "superadmin/SuperAdminTicketManagementCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["TicketGroups"],
    }),
    deleteTicketGroup: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/SuperAdminTicketManagementCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TicketGroups"],
    }),

    // Tickets List
    getTicketsList: builder.query<TicketRecord[], void>({
      query: () => "superadmin/TicketAdditional/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0 ? raw : MOCK_TICKETS;
      },
      providesTags: ["Tickets"],
    }),
    createTicket: builder.mutation<any, Partial<TicketRecord>>({
      query: (payload) => ({
        url: "superadmin/TicketCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tickets"],
    }),
    updateTicket: builder.mutation<any, Partial<TicketRecord>>({
      query: (payload) => ({
        url: "superadmin/TicketCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Tickets"],
    }),
    deleteTicket: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/TicketCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets"],
    }),

    // Dropdowns & Lookups for Tickets
    getTicketRelatedLookups: builder.query<string[], void>({
      query: () => "superadmin/Userlookuplist/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        if (Array.isArray(raw)) {
          const match = raw.find(
            (item: any) => item.Lookupname === "Ticket Related To",
          );
          if (match && Array.isArray(match.Values)) {
            return match.Values.map((v: any) =>
              typeof v === "object" ? v.value || v.name : String(v),
            );
          }
        }
        return [
          "Billing Issue",
          "Software Bug",
          "Account Access",
          "Feature Request",
          "Hardware Issue",
          "General Support",
        ];
      },
    }),
    getCRMUsersList: builder.query<
      Array<{ id: string | number; name: string }>,
      void
    >({
      query: () => "superadmin/CRMUserlist/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        if (Array.isArray(raw) && raw.length > 0) {
          return raw.map((u: any) => ({
            id: u.id,
            name: u.first_name
              ? `${u.first_name} ${u.last_name || ""}`.trim()
              : u.username || `User ${u.id}`,
          }));
        }
        return [
          { id: "1", name: "Sarah Jenkins" },
          { id: "2", name: "Alex Rivera" },
          { id: "3", name: "DevOps Security" },
          { id: "4", name: "Finance Support Team" },
          { id: "5", name: "Product Management Team" },
        ];
      },
    }),

    // ----------------------------------------------------------------------
    // SETTINGS MODULE ENDPOINTS
    // ----------------------------------------------------------------------

    // Product Menu Setup
    getMenuListByProduct: builder.query<ProductMenuRecord[], string | void>({
      query: (product) =>
        `auth/MenuListproductwithoutpagination/${product ? `?product=${product}` : ""}`,
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0 ? raw : MOCK_PRODUCT_MENUS;
      },
      providesTags: ["ProductMenus"],
    }),
    createMenu: builder.mutation<any, Partial<ProductMenuRecord>>({
      query: (payload) => ({
        url: "auth/menuCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ProductMenus"],
    }),
    updateMenu: builder.mutation<any, Partial<ProductMenuRecord>>({
      query: (payload) => ({
        url: "auth/menuCRUD/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["ProductMenus"],
    }),
    deleteMenu: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: "auth/menuCRUD/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["ProductMenus"],
    }),

    // Company Details
    getCompanyDetails: builder.query<CompanyDetailsRecord, void>({
      query: () => "useradmin/CRMorganizationCRUD/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        if (Array.isArray(raw) && raw.length > 0) return raw[0];
        if (
          raw &&
          typeof raw === "object" &&
          !Array.isArray(raw) &&
          Object.keys(raw).length > 0
        )
          return raw;
        return MOCK_COMPANY_DETAILS;
      },
      providesTags: ["CompanyDetails"],
    }),
    updateCompanyDetails: builder.mutation<any, Partial<CompanyDetailsRecord>>({
      query: (payload) => ({
        url: "useradmin/CRMorganizationCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CompanyDetails"],
    }),
    getCompanyBankDetails: builder.query<any, void>({
      query: () => "useradmin/UserorganizationmasterBankDetailsCRUD/",
      transformResponse: (res: any) => {
        const raw = res?.data || res;
        return raw || MOCK_COMPANY_DETAILS.bank_details;
      },
      providesTags: ["CompanyDetails"],
    }),
    updateCompanyBankDetails: builder.mutation<any, any>({
      query: (payload) => ({
        url: "useradmin/UserorganizationmasterBankDetailsCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CompanyDetails"],
    }),

    // Roles and Users
    getRolesList: builder.query<RoleRecord[], void>({
      query: () => "useradmin/Rolelist/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0 ? raw : MOCK_ROLES;
      },
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation<any, Partial<RoleRecord>>({
      query: (payload) => ({
        url: "useradmin/RoleCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: builder.mutation<any, Partial<RoleRecord>>({
      query: (payload) => ({
        url: "useradmin/RoleCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Roles"],
    }),
    deleteRole: builder.mutation<
      any,
      { Role_Id?: string; id?: string | number }
    >({
      query: ({ Role_Id, id }) => ({
        url: `useradmin/RoleCRUD/?Role_Id=${Role_Id || id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
    getPermissionsList: builder.query<any[], void>({
      query: () => "useradmin/PermissionList/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0
          ? raw
          : [
              { id: 1, name: "Dashboard View", code: "dashboard.view" },
              {
                id: 2,
                name: "Customer Accounts Manage",
                code: "accounts.manage",
              },
              { id: 3, name: "Plans & Pricing Manage", code: "plans.manage" },
              { id: 4, name: "Invoices & Billing", code: "invoices.manage" },
              { id: 5, name: "Support Tickets Manage", code: "tickets.manage" },
              {
                id: 6,
                name: "System Settings Manage",
                code: "settings.manage",
              },
            ];
      },
    }),
    getUserAdminList: builder.query<UserAdminRecord[], void>({
      query: () => "useradmin/UserAdditional/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0 ? raw : MOCK_USER_ADMINS;
      },
      providesTags: ["Roles"],
    }),
    createUserAdmin: builder.mutation<
      any,
      Partial<UserAdminRecord> & { password?: string }
    >({
      query: (payload) => ({
        url: "useradmin/UserCreate/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Roles"],
    }),
    updateUserAdmin: builder.mutation<any, Partial<UserAdminRecord>>({
      query: (payload) => ({
        url: "useradmin/UserCRUD/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Roles"],
    }),
    deleteUserAdmin: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `useradmin/user/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),

    // Storage Master
    getStorageMasterList: builder.query<StorageMasterRecord[], void>({
      query: () => "superadmin/storagemasterlist/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0 ? raw : MOCK_STORAGE_MASTER;
      },
      providesTags: ["StorageMaster"],
    }),
    createStorageMaster: builder.mutation<any, Partial<StorageMasterRecord>>({
      query: (payload) => ({
        url: "superadmin/storagemaster/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["StorageMaster"],
    }),
    updateStorageMaster: builder.mutation<any, Partial<StorageMasterRecord>>({
      query: (payload) => ({
        url: "superadmin/storagemaster/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["StorageMaster"],
    }),
    deleteStorageMaster: builder.mutation<
      any,
      { Storage_Id?: string; id?: string | number }
    >({
      query: ({ Storage_Id, id }) => ({
        url: `superadmin/storagemaster/?Storage_Id=${Storage_Id || id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StorageMaster"],
    }),

    // User Master
    getUserMasterList: builder.query<UserMasterRecord[], void>({
      query: () => "superadmin/AdditionalUserMasterList/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0 ? raw : MOCK_USER_MASTER;
      },
      providesTags: ["UserMaster"],
    }),
    createUserMaster: builder.mutation<any, Partial<UserMasterRecord>>({
      query: (payload) => ({
        url: "superadmin/AdditionalUserMasterCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UserMaster"],
    }),
    updateUserMaster: builder.mutation<any, Partial<UserMasterRecord>>({
      query: (payload) => ({
        url: "superadmin/AdditionalUserMasterCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["UserMaster"],
    }),
    deleteUserMaster: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/AdditionalUserMasterCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserMaster"],
    }),

    // Addon Master
    getAddonMasterList: builder.query<AddonMasterRecord[], void>({
      query: () => "superadmin/AddonAdditional/?Is_Deleted=False",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) && raw.length > 0 ? raw : MOCK_ADDON_MASTER;
      },
      providesTags: ["AddonMaster"],
    }),
    createAddonMaster: builder.mutation<any, Partial<AddonMasterRecord>>({
      query: (payload) => ({
        url: "superadmin/AddonAdditional/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AddonMaster"],
    }),
    updateAddonMaster: builder.mutation<any, Partial<AddonMasterRecord>>({
      query: (payload) => ({
        url: "superadmin/AddonAdditional/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AddonMaster"],
    }),
    deleteAddonMaster: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `superadmin/Addon/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AddonMaster"],
    }),

    // System Preferences
    getSystemPreferences: builder.query<SystemPreferenceRecord, void>({
      query: () => "useradmin/SystemPreferenceCRUD/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        if (Array.isArray(raw) && raw.length > 0) return raw[0];
        if (
          raw &&
          typeof raw === "object" &&
          !Array.isArray(raw) &&
          Object.keys(raw).length > 0
        )
          return raw;
        return MOCK_SYSTEM_PREFERENCE;
      },
      providesTags: ["SystemPreferences"],
    }),
    saveSystemPreferences: builder.mutation<
      any,
      Partial<SystemPreferenceRecord>
    >({
      query: (payload) => ({
        url: "useradmin/SystemPreferenceCRUD/",
        method: payload.id ? "PUT" : "POST",
        body: payload,
      }),
      invalidatesTags: ["SystemPreferences"],
    }),

    // Product Master Endpoints
    getProductMasterList: builder.query<ProductMasterRecord[], void>({
      query: () => "superadmin/ProductMasterCRUD/",
      transformResponse: (res: any) => {
        const raw = res?.data || res?.results || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["ProductMasters"],
    }),
    getProductMasterPaginated: builder.query<
      {
        count: number;
        next: string | null;
        previous: string | null;
        results: any[];
      },
      {
        page?: number;
        page_size?: number;
        search?: string;
        Category?: string;
        Product_Name?: string;
        Product_Code?: string;
      } | void
    >({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.set("page", String(params.page));
        if (params?.page_size) qp.set("page_size", String(params.page_size));
        if (params?.search?.trim()) qp.set("search", params.search.trim());
        if (params?.Category && params.Category !== "All") {
          qp.set("Category", params.Category);
        }
        if (params?.Product_Name) qp.set("Product_Name", params.Product_Name);
        if (params?.Product_Code) qp.set("Product_Code", params.Product_Code);
        const qs = qp.toString();
        return `superadmin/ProductMasterList/${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: any) => {
        if (Array.isArray(res)) {
          return { count: res.length, next: null, previous: null, results: res };
        }
        const results = Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res?.data)
          ? res.data
          : [];
        return {
          count: typeof res?.count === "number" ? res.count : results.length,
          next: res?.next ?? null,
          previous: res?.previous ?? null,
          results,
        };
      },
      providesTags: ["ProductMasters"],
    }),
    getProductMasterLookups: builder.query<
      Array<{
        id: number;
        Product_Id?: string;
        Product_Code: string;
        Product_Name: string;
        Category?: string;
      }>,
      void
    >({
      query: () => "superadmin/ProductMasterLookups/",
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["ProductMasters"],
    }),
    filterProductMaster: builder.query<
      any[],
      {
        search?: string;
        Status?: string;
        Category?: string;
        Lifecycle_stage?: string;
      }
    >({
      query: (body) => ({
        url: "superadmin/ProductMasterFilter/",
        method: "POST",
        body,
      }),
      transformResponse: (res: any) => {
        const raw = res?.results || res?.data || res;
        return Array.isArray(raw) ? raw : [];
      },
      providesTags: ["ProductMasters"],
    }),
    getProductMasterById: builder.query<any, string | number>({
      query: (id) => `superadmin/ProductMasterCRUD/?id=${id}`,
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["ProductMasters"],
    }),
    createProductMaster: builder.mutation<any, Record<string, any> | FormData>({
      query: (payload) => ({
        url: "superadmin/ProductMasterCRUD/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ProductMasters"],
    }),
    updateProductMaster: builder.mutation<any, Record<string, any> | FormData>({
      query: (payload) => ({
        url: "superadmin/ProductMasterCRUD/",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ProductMasters"],
    }),
    deleteProductMaster: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `superadmin/ProductMasterCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductMasters"],
    }),
    deactivateProductMaster: builder.mutation<
      any,
      { id: string | number; status: string; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `superadmin/ProductMasterAPI/${id}/deactivate/`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: ["ProductMasters"],
    }),
    submitProductApproval: builder.mutation<
      any,
      {
        id: string | number;
        action: "SUBMIT" | "APPROVE" | "REJECT";
        notes?: string;
      }
    >({
      query: ({ id, action, notes }) => ({
        url: `superadmin/ProductMasterAPI/${id}/approval/`,
        method: "POST",
        body: { action, notes },
      }),
      invalidatesTags: ["ProductMasters"],
    }),

    // Product Category Master Endpoints (Integrated with Live Django Backend)
    getProductCategoryList: builder.query<any, { page?: number; search?: string } | void>({
      query: (params) => {
        const page = params && typeof params === 'object' && params.page ? params.page : 1;
        const search = params && typeof params === 'object' && params.search ? `&search=${encodeURIComponent(params.search)}` : '';
        return `superadmin/ProductCategoryListwithPagination/?page=${page}${search}`;
      },
      providesTags: ['ProductCategories'],
    }),
    getProductCategoryById: builder.query<any, string | number>({
      query: (id) => `superadmin/ProductCategoryCRUD/?id=${id}`,
      providesTags: ['ProductCategories'],
    }),
    createProductCategory: builder.mutation<any, Partial<any>>({
      query: (payload) => ({
        url: 'superadmin/ProductCategoryCRUD/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ProductCategories'],
    }),
    updateProductCategory: builder.mutation<any, Partial<any>>({
      query: (payload) => ({
        url: 'superadmin/ProductCategoryCRUD/',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['ProductCategories'],
    }),
    deleteProductCategory: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `superadmin/ProductCategoryCRUD/?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductCategories'],
    }),
  }),
});

export const {
  useGetSubscriptionAnalyticsQuery,
  useGetSubscriptionInsightsQuery,
  useGetUsageAnalyticsQuery,
  useGetInstanceAnalyticsQuery,
  useGetRevenueForecastDashboardQuery,
  useGetPaymentDashboardAnalyticsQuery,
  useGetRenewalDashboardAnalyticsQuery,
  useGetRenewalFunnelAnalyticsQuery,
  useGetCancellationOverviewAnalyticsQuery,
  useGetPlanAdoptionDashboardAnalyticsQuery,
  useGetTopPlansDistributionAnalyticsQuery,
  useGetRequestOperationsDashboardQuery,
  useGetAccountsListQuery,
  useGetAccountsPaginatedListQuery,
  useLazyGetAccountsPaginatedListQuery,
  useSearchCustomerAccountsPaginatedQuery,
  useLazySearchCustomerAccountsPaginatedQuery,
  useSearchAccountsQuery,
  useLazySearchAccountsQuery,
  useFilterAccountsQuery,
  useLazyFilterAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetPlansListQuery,
  useFilterPlansQuery,
  useLazyFilterPlansQuery,
  useGetPlanComparisonMatrixQuery,
  useMutatePlanComparisonMatrixMutation,
  usePublishPlansMutation,
  useGetProductConfigurationsQuery,
  useGetPlanLimitsListQuery,
  useLazyGetPlanLimitsListQuery,
  useGetProductFeaturesListQuery,
  useLazyGetProductFeaturesListQuery,
  useSaveProductConfigurationMutation,
  useGetProductPricingListQuery,
  useGetProductPricingKpiQuery,
  useGetProductPriceMatrixQuery,
  useGetProductPriceHistoryQuery,
  useGetProductEditionsListQuery,
  useCreateProductPricingMutation,
  useUpdateProductPricingMutation,
  useDeleteProductPricingMutation,
  useBulkUpdateProductPricingMutation,
  useScheduleProductPricingMutation,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetSubscriptionsListQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetInvoicesListQuery,
  useGetInvoiceFullListQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useGetPaymentsListQuery,
  useGetPaymentsFullListQuery,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useGetInstanceRequestsListQuery,
  useCreateInstanceRequestMutation,
  useUpdateInstanceRequestMutation,
  useDeleteInstanceRequestMutation,
  useGetPendingInstanceRequestsQuery,
  useGetProvisionedInstancesQuery,
  useCreateProvisionedInstanceMutation,
  useGetProductDropdownQuery,
  useGetAddonListQuery,
  useGetAccountFullListQuery,
  useGetAccountByIdQuery,
  useLazyGetAccountByIdQuery,
  useGetCustomerKpiAnalyticsQuery,
  useGetCustomerOverviewAnalyticsQuery,
  useLazyGetCustomerOverviewAnalyticsQuery,
  useGetCustomerAuditHistoryQuery,
  useLazyGetCustomerAuditHistoryQuery,
  useFilterCustomerAuditHistoryQuery,
  useLazyFilterCustomerAuditHistoryQuery,
  useGetCustomerDocumentListQuery,
  useLazyGetCustomerDocumentListQuery,
  useUploadCustomerDocumentMutation,
  useDeleteCustomerDocumentMutation,
  useGetPlanByIdQuery,
  useLazyGetPlanByIdQuery,
  useGetMenuListQuery,
  useGetIndustryListQuery,
  useGetAdditionalLicenseListQuery,
  useCreateAdditionalLicenseMutation,
  useUpdateAdditionalLicenseMutation,
  useDeleteAdditionalLicenseMutation,
  useGetAddonSubscriptionListQuery,
  useCreateAddonSubscriptionMutation,
  useUpdateAddonSubscriptionMutation,
  useDeleteAddonSubscriptionMutation,
  useGetAdditionalStorageListQuery,
  useCreateAdditionalStorageMutation,
  useUpdateAdditionalStorageMutation,
  useDeleteAdditionalStorageMutation,
  useGetRenewalDueListQuery,
  useCreateRenewalMutation,
  useUpdateRenewalMutation,
  useDeleteRenewalMutation,
  useGetCancelPlanListQuery,
  useCreateCancelPlanMutation,
  useDeleteCancelPlanMutation,
  useGetTasksListQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetProjectsListQuery,
  useGetTicketGroupsListQuery,
  useCreateTicketGroupMutation,
  useUpdateTicketGroupMutation,
  useDeleteTicketGroupMutation,
  useGetTicketsListQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetTicketRelatedLookupsQuery,
  useGetCRMUsersListQuery,
  // Settings Module Hooks
  useGetMenuListByProductQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useGetCompanyDetailsQuery,
  useUpdateCompanyDetailsMutation,
  useGetCompanyBankDetailsQuery,
  useUpdateCompanyBankDetailsMutation,
  useGetRolesListQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsListQuery,
  useGetUserAdminListQuery,
  useCreateUserAdminMutation,
  useUpdateUserAdminMutation,
  useDeleteUserAdminMutation,
  useGetStorageMasterListQuery,
  useCreateStorageMasterMutation,
  useUpdateStorageMasterMutation,
  useDeleteStorageMasterMutation,
  useGetUserMasterListQuery,
  useCreateUserMasterMutation,
  useUpdateUserMasterMutation,
  useDeleteUserMasterMutation,
  useGetAddonMasterListQuery,
  useCreateAddonMasterMutation,
  useUpdateAddonMasterMutation,
  useDeleteAddonMasterMutation,
  useGetSystemPreferencesQuery,
  useSaveSystemPreferencesMutation,
  useGetProductMasterListQuery,
  useGetProductMasterPaginatedQuery,
  useGetProductMasterLookupsQuery,
  useFilterProductMasterQuery,
  useLazyFilterProductMasterQuery,
  useGetProductMasterByIdQuery,
  useCreateProductMasterMutation,
  useUpdateProductMasterMutation,
  useDeleteProductMasterMutation,
  useDeactivateProductMasterMutation,
  useSubmitProductApprovalMutation,
  useGetProductCategoryListQuery,
  useGetProductCategoryByIdQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = superAdminApi;

/**
 * Downloads account records as a CSV file directly from the backend AccountExportAPI.
 * Streams data directly into browser memory and triggers immediate download.
 */
export const downloadAccountsExportCsv = async (params?: {
  product?: string;
  search?: string;
  status?: string;
  ids?: string[];
  customerId?: string;
}): Promise<boolean> => {
  try {
    const primaryHost = normalizeApiUrl();
    const tenantName = getTenantName();
    const query = new URLSearchParams();
    if (params?.customerId && params.customerId !== "ALL")
      query.set("customer_id", params.customerId);
    if (params?.product && params.product !== "All Products")
      query.set("Primary_Product", params.product);
    if (params?.search?.trim()) query.set("search", params.search.trim());
    if (params?.status && params.status !== "All")
      query.set("Account_Status", params.status);
    if (params?.ids && params.ids.length > 0)
      query.set("ids", params.ids.join(","));

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") ||
          localStorage.getItem("accesstoken") ||
          localStorage.getItem("access_token") ||
          ""
        : "";
    const dbName =
      typeof window !== "undefined"
        ? localStorage.getItem("DBName") || "crmuseradmin1"
        : "crmuseradmin1";

    if (token) {
      query.set("token", token);
    }

    const url = `${primaryHost}/${tenantName}/superadmin/AccountExportAPI/?${query.toString()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/csv, */*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        db: dbName,
        Db: dbName,
      },
    });

    if (!res.ok) {
      throw new Error(`Export failed with status ${res.status}`);
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    const contentDisposition = res.headers.get("content-disposition");
    let filename = `customers_export_${new Date().toISOString().split("T")[0]}.csv`;
    if (contentDisposition && contentDisposition.includes("filename=")) {
      const match = contentDisposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) filename = match[1];
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  } catch (error) {
    console.warn(
      "Backend export failed, falling back to local CSV export:",
      error,
    );
    return false;
  }
};

export const downloadProductMasterExportCsv = (params?: {
  search?: string;
  Status?: string;
  Category?: string;
  ids?: Array<string | number>;
}): Promise<boolean> =>
  downloadSuperAdminExportCsv({
    endpoint: "ProductMasterExport/",
    query: {
      search: params?.search,
      Status: params?.Status && params.Status !== "All" ? params.Status : undefined,
      Category:
        params?.Category && params.Category !== "All" ? params.Category : undefined,
      ids: params?.ids && params.ids.length > 0 ? params.ids.join(",") : undefined,
    },
    defaultFilename: `product_master_export_${new Date().toISOString().split("T")[0]}.csv`,
  });

export const downloadPlanComparisonExportCsv = (params?: {
  product?: string | number;
  Plantype?: string;
  status?: string;
  search?: string;
}): Promise<boolean> =>
  downloadSuperAdminExportCsv({
    endpoint: "PlanComparisonExport/",
    query: {
      product: params?.product && String(params.product) !== "ALL" ? String(params.product) : undefined,
      Plantype: params?.Plantype && params.Plantype !== "All" ? params.Plantype : undefined,
      status: params?.status && params.status !== "All" ? params.status : undefined,
      search: params?.search?.trim() || undefined,
    },
    defaultFilename: `plans_comparison_${new Date().toISOString().split("T")[0]}.csv`,
  });

export const downloadProductPricingExportCsv = (params?: {
  Product?: string;
  Edition?: string;
  Plan?: string;
  Country?: string;
  Currency?: string;
  Status?: string;
  search?: string;
  ids?: Array<string | number>;
}): Promise<boolean> =>
  downloadSuperAdminExportCsv({
    endpoint: "ProductPricingExport/",
    query: {
      Product: params?.Product && params.Product !== "All" ? params.Product : undefined,
      Edition: params?.Edition && params.Edition !== "All" ? params.Edition : undefined,
      Plan: params?.Plan && params.Plan !== "All Plans" ? params.Plan : undefined,
      Country: params?.Country && params.Country !== "All Countries" ? params.Country : undefined,
      Currency: params?.Currency && params.Currency !== "All Currencies" ? params.Currency : undefined,
      Status: params?.Status && params.Status !== "All" ? params.Status : undefined,
      search: params?.search?.trim() || undefined,
      ids: params?.ids && params.ids.length > 0 ? params.ids.join(",") : undefined,
    },
    defaultFilename: `product_pricing_export_${new Date().toISOString().split("T")[0]}.csv`,
  });

// Re-export Add-on Price Template API hooks and types
export * from "./addonPriceTemplateApi";
export * from "./addonPricingApi";
export * from "./addonDiscountCouponApi";
export * from "./addonTieredPricingApi";
export * from "./addonPriceHistoryApi";
export * from "./dashboardApi";

