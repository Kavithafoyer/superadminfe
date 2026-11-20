// Master Addon Types
export interface AddonRecord {
  id: string;
  code: string;
  name: string;
  category: string;
  supportedProducts: string[];
  licenseModel: 'Per Tenant' | 'Per User' | 'Usage Based';
  startingPrice: string;
  status: 'Published' | 'Draft' | 'Inactive';
  shortDescription: string;
  fullDescription: string;
  trialAvailable: boolean;
  trialDays: number;
  billingType: 'Recurring' | 'One-time' | 'Usage-based';
  displayOrder: number;
  icon?: string;
  version?: string;
  features?: string[];
}

// Category Types
export interface CategoryRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  addonsCount: number;
  status: 'Active' | 'Draft' | 'Inactive';
  displayOrder: number;
  parentCategory?: string;
  showInMarketplace: boolean;
  icon?: string;
}

// Pricing Types
export interface PlanPriceTier {
  planName: 'Standard' | 'Professional' | 'Enterprise';
  price: number;
  trialDays: number;
  enabled: boolean;
}

export interface AddonPricingRecord {
  id: string;
  addonCode: string;
  addonName: string;
  category: string;
  pricingModel: 'Per Tenant' | 'Per User' | 'Per Usage';
  plansPriceDisplay: string;
  status: 'Active' | 'Draft' | 'Inactive';
  billingCycle: 'Monthly' | 'Annual' | 'Quarterly';
  planTiers: PlanPriceTier[];
  allowAnnualDiscount: boolean;
  annualDiscountPercentage: number;
  showInMarketplace: boolean;
  allowTrialForNewCustomers: boolean;
  requireApprovalForActivation: boolean;
}

// Price Template Types
export interface TemplateTier {
  tierName: string;
  price: number;
  userLimit: string;
  storage: string;
  features: string;
}

export interface PriceTemplateRecord {
  id: string;
  code: string;
  name: string;
  type: 'Subscription' | 'Usage' | 'Hybrid';
  billingCycle: 'Monthly' | 'Annual';
  currency: string;
  tiersCount: number;
  appliedAddonsCount: number;
  status: 'Active' | 'Draft' | 'Inactive';
  description: string;
  tiers: TemplateTier[];
  showTemplateForNewAddons: boolean;
  allowCustomizationAtAddonLevel: boolean;
}

// Tiered Pricing Types
export interface TierVolumeConfig {
  tierId: string;
  tierLabel: string;
  usageRange: string;
  pricePerUnit: number;
  effectivePrice: number;
  discount: string;
}

export interface TieredPricingRecord {
  id: string;
  code: string;
  name: string;
  addonName: string;
  billingCycle: 'Monthly' | 'Annual';
  tiersCount: number;
  status: 'Active' | 'Draft' | 'Inactive';
  unitMetric: string;
  tiers: TierVolumeConfig[];
}

// Discounts & Coupons Types
export interface DiscountRecord {
  id: string;
  name: string;
  type: 'Percentage' | 'Flat Amount';
  applicability: 'Subscription' | 'Add-on' | 'All';
  discountValue: string;
  validityPeriod: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Draft' | 'Scheduled' | 'Expired';
  supportedProducts: string[];
  applicablePlans: string[];
  scope: 'All Customers' | 'New Customers Only' | 'Existing Customers Only';
  limitTotalRedemptions?: number;
  limitPerCustomer?: number;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountName: string;
  type: 'Percentage' | 'Flat Amount';
  value: string;
  maxUsage: number;
  currentUsage: number;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

// Compatibility Types
export type CompatibilityStatus = 'compatible' | 'incompatible' | 'dependency';

export interface CompatibilityMatrixRow {
  id: string;
  addonName: string;
  category: string;
  matrix: {
    education: CompatibilityStatus;
    it: CompatibilityStatus;
    people: CompatibilityStatus;
    retail: CompatibilityStatus;
    realEstate: CompatibilityStatus;
    crm: CompatibilityStatus;
  };
  applicableProducts: string[];
  compatibilityType: 'Compatible' | 'Incompatible' | 'Dependency' | 'Not Compatible' | 'Requires Dependency';
  dependencies: string[];
  versionConstraint: boolean;
  minVersion: string;
  maxVersion: string;
  ruleDescription: string;
  status: 'Active' | 'Draft' | 'Inactive';
}

// Price History Types
export interface PriceChangeRecord {
  id: string;
  effectiveDate: string;
  previousPrice: number | null;
  newPrice: number;
  changeAmount: number | null;
  changePercentage: number | null;
  reason: string;
  changedBy: string;
}

export interface PriceHistoryItem {
  id: string;
  product: string;
  addonName: string;
  category: string;
  currentPrice: number;
  initialPrice: number;
  totalChanges: number;
  lastUpdated: string;
  history: PriceChangeRecord[];
}

