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
  image: string | null;
  lowStockThreshold: number;
  taxRate: number;
  taxInclusive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Color"
  value: string; // e.g. "Small", "Red"
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
  customer?: string;
  paymentMethod?: string;
}

export type TabsType = 'dashboard' | 'inventory' | 'transactions' | 'reports' | 'settings';

export interface FinancialPeriod {
  startDate: string;
  endDate: string;
  label: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  email: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: 'lowStock' | 'sale' | 'system' | 'other';
  linkTo?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
  paymentMethod: string;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  applyToAll: boolean;
  appliedCategories?: string[];
  appliedProducts?: string[];
  startDate?: string;
  endDate?: string;
  active: boolean;
  createdAt: string;
}

export type DateFilterType = 'week' | 'month' | 'year' | 'custom' | 'quarter';
