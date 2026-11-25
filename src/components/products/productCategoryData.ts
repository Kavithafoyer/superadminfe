export interface OrganizationOption {
  id: number | string;
  name: string;
  code: string;
}

export interface ProductCategoryRecord {
  id: number;
  Category_Id: string;
  Category_Code: string;
  Category_Name: string | null;
  Description: string | null;
  Is_Active: boolean;
  Is_Deleted: boolean;
  Created_Date: string;
  Updated_Date: string;
  Organization_Id: number;
  organization_name?: string;
  created_by_name?: string;
  updated_by_name?: string;
  Created_By: number;
  Updated_By: number;
  // UI helpers
  products_count?: number;
  icon_type?: string;
}

export interface ProductCategoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductCategoryRecord[];
}

export interface ProductCategoryPayload {
  id?: number;
  Organization_Id: number;
  Category_Name: string;
  Category_Code?: string;
  Category_Id?: string;
  Description?: string;
  Is_Active?: boolean;
  Is_Deleted?: boolean;
  Created_By?: number;
  Updated_By?: number;
}

export const AVAILABLE_ORGANIZATIONS: OrganizationOption[] = [
  { id: 1, name: 'Foyer tech (Organization #1)', code: 'ORG-1' },
];

export function generateCategoryId(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  return `PCY-${yearMonth}-${randomSuffix}`;
}
