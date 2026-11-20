export interface AddonItem {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  currency: string;
  maxUsers?: number;
  storageGb?: number;
  status: 'active' | 'inactive' | 'draft';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AddonCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface AddonFilterState {
  search: string;
  category: string;
  status: string;
  billingCycle: string;
}
