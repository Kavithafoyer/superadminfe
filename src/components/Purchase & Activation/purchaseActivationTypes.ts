export type ProductType =
  | 'Pegatto CRM'
  | 'Pegatto Education'
  | 'Pegatto IT'
  | 'Pegatto People'
  | 'Pegatto Retail'
  | 'Pegatto Real Estate';

export type PlanEdition = 'Standard' | 'Professional' | 'Enterprise';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export type ActivationStatus = 'Activated' | 'Pending' | 'Failed' | 'Active';

export type RequestStatus = 'Pending' | 'In Review' | 'Approved' | 'Rejected';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type SubMenuTab =
  | 'Purchases'
  | 'Activations'
  | 'Activation Queue'
  | 'Payment Transactions'
  | 'Invoices';

// 1. Purchase Item
export interface PurchaseRecord {
  id: string; // e.g. PUR-100458
  customerTenant: string;
  product: ProductType;
  planEdition: PlanEdition;
  purchaseDate: string;
  amount: number;
  paymentStatus: PaymentStatus;
  activationStatus: ActivationStatus;
  channel?: string;
  invoiceNo?: string;
  activationDate?: string;
  validity?: string;
  timeline?: {
    title: string;
    date: string;
    completed: boolean;
  }[];
}

// 2. Activation Item
export interface ActivationRecord {
  id: string; // e.g. ACT-100458
  customerTenant: string;
  product: ProductType;
  planEdition: PlanEdition;
  activatedOn: string;
  validity: string;
  status: 'Active' | 'Failed' | 'Pending' | 'Renewed';
  purchaseId: string;
  licenseKey: string;
  entitlements: {
    users: string; // e.g. "25 / 50"
    storage: string; // e.g. "100 GB"
    coreModules: string;
    addOns: string;
  };
  timeline: {
    title: string;
    date: string;
    completed: boolean;
  }[];
}

// 3. Activation Queue Item
export interface ActivationQueueRecord {
  id: string; // e.g. AQ-100458
  customerTenant: string;
  product: ProductType;
  planEdition: PlanEdition;
  requestType: 'Activation' | 'Add-on';
  requestedOn: string;
  status: RequestStatus;
  priority: PriorityLevel;
  requestedBy: string;
  processTimeline: {
    title: string;
    detail: string;
    status: 'completed' | 'in-progress' | 'pending';
  }[];
}

// 4. Payment Transaction Item
export interface PaymentTransactionRecord {
  id: string; // e.g. TXN-100458
  orderId: string; // e.g. ORD-78421
  customerTenant: string;
  productPlan: string; // e.g. Pegatto CRM – Professional
  amount: number;
  paymentMethod: string; // Razorpay (UPI), Credit Card, Net Banking, UPI, Razorpay (Card)
  status: 'Success' | 'Failed' | 'Refunded' | 'Pending';
  dateTime: string;
  paymentRefNo: string;
  invoiceNo: string;
  timeline: {
    title: string;
    date: string;
    completed: boolean;
  }[];
}

// 5. Invoice Item
export interface InvoiceRecord {
  id: string; // e.g. INV-100458
  customerTenant: string;
  productPlan: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Draft' | 'Cancelled';
  amountExclTax: number;
  gst18: number;
  paymentInfo?: {
    status: string;
    date: string;
    method: string;
    transactionId: string;
  };
  timeline: {
    title: string;
    date: string;
    completed: boolean;
  }[];
}


