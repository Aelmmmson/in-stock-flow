
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
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  recurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export type TabsType = 'dashboard' | 'inventory' | 'transactions' | 'reports' | 'settings';

export interface FinancialPeriod {
  startDate: string;
  endDate: string;
  label: string;
}
