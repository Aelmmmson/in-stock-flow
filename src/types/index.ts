
// Basic types
export type TabsType = 'dashboard' | 'inventory' | 'transactions' | 'expenses' | 'reports' | 'settings';

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
  purchaseCost: number;
  sellingPrice: number;
  description: string;
  variants: ProductVariant[];
  image?: string | null;
  lowStockThreshold: number;
  taxRate: number;
  taxInclusive: boolean;
  discount?: number;
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  productId: string;
  quantity: number;
  originalPrice: number;
  actualPrice: number;
  priceDelta: number;
  totalAmount: number;
  type: 'sale' | 'purchase' | 'adjustment';
  notes: string;
  createdAt: string;
  createdBy: string;
  branchId: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  notes: string;
  date: string;
  paymentMethod: string;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  branchId?: string;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  applyToAll: boolean;
  appliedProducts?: string[];
  appliedCategories?: string[];
  minimumPurchase?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  timesUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialPeriod {
  startDate: string;
  endDate: string;
  label: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
