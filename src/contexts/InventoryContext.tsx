import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Transaction, Expense, Discount, ProductCategory } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useAuth, UserRole } from './AuthContext';

// Update the User interface to use the UserRole from AuthContext
interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string | null;
}

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Floral Summer Dress',
    sku: 'DRESS-FLR-001',
    category: 'Dresses',
    supplier: 'Fashion Direct Ltd.',
    quantity: 15,
    purchaseCost: 80,
    sellingPrice: 150,
    description: 'Beautiful floral summer dress, perfect for casual outings',
    variants: [
      { id: '1-1', name: 'Size', value: 'M' },
      { id: '1-2', name: 'Color', value: 'Blue' }
    ],
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    lowStockThreshold: 5,
    taxRate: 10,
    taxInclusive: false,
    discount: 10,
    branchId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Leather Handbag',
    sku: 'BAG-LTH-002',
    category: 'Bags',
    supplier: 'Luxury Accessories Co.',
    quantity: 8,
    purchaseCost: 120,
    sellingPrice: 299.99,
    description: 'Premium leather handbag with gold-plated details',
    variants: [
      { id: '2-1', name: 'Color', value: 'Black' },
      { id: '2-2', name: 'Material', value: 'Genuine Leather' }
    ],
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    lowStockThreshold: 3,
    taxRate: 8,
    taxInclusive: true,
    branchId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Gold Hoop Earrings',
    sku: 'JEWL-ERG-003',
    category: 'Jewelry',
    supplier: 'Glamour Accessories Inc.',
    quantity: 2,
    purchaseCost: 45,
    sellingPrice: 89.99,
    description: '18k gold-plated hoop earrings, hypoallergenic',
    variants: [
      { id: '3-1', name: 'Size', value: 'Medium' }
    ],
    image: null,
    lowStockThreshold: 5,
    taxRate: 10,
    taxInclusive: false,
    discount: 15,
    branchId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Sample transactions
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    productId: '1',
    quantity: 2,
    originalPrice: 150,
    actualPrice: 140,
    priceDelta: -10,
    totalAmount: 280,
    type: 'sale',
    notes: 'Loyal customer discount',
    createdAt: new Date().toISOString(),
    createdBy: '1',
    branchId: '1',
  },
  {
    id: '2',
    productId: '3',
    quantity: 1,
    originalPrice: 89.99,
    actualPrice: 89.99,
    priceDelta: 0,
    totalAmount: 89.99,
    type: 'sale',
    notes: '',
    createdAt: new Date().toISOString(),
    createdBy: '1',
    branchId: '2',
  }
];

// Sample expenses
const sampleExpenses: Expense[] = [
  {
    id: '1',
    category: 'Rent',
    amount: 1200,
    notes: 'Monthly store rent',
    date: new Date().toISOString(),
    paymentMethod: 'Bank Transfer',
    recurring: true,
    frequency: 'monthly',
    branchId: '1'
  },
  {
    id: '2',
    category: 'Utilities',
    amount: 250,
    notes: 'Electricity and water bill',
    date: new Date().toISOString(),
    paymentMethod: 'Cash',
    recurring: true,
    frequency: 'monthly',
    branchId: '1'
  },
  {
    id: '3',
    category: 'Salaries',
    amount: 1800,
    notes: 'Staff salaries',
    date: new Date().toISOString(),
    paymentMethod: 'Bank Transfer',
    recurring: true,
    frequency: 'monthly',
    branchId: '2'
  }
];

// Sample categories
const sampleCategories: ProductCategory[] = [
  {
    id: '1',
    name: 'Dresses',
    description: 'Women\'s dresses and formal wear',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Bags',
    description: 'Handbags, purses, and accessories',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Jewelry',
    description: 'Rings, earrings, necklaces and accessories',
    createdAt: new Date().toISOString()
  }
];

interface InventoryContextType {
  products: Product[];
  transactions: Transaction[];
  expenses: Expense[];
  currentUser: User | null;  // Updated to match AuthContext's User | null type
  currencySymbol: string;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'priceDelta'>) => void;
  getProduct: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  getFinancialSummary: (startDate: Date, endDate: Date) => {
    totalSales: number;
    totalExpenses: number;
    profit: number;
    topSellingProducts: { name: string; quantity: number; revenue: number }[];
  };
  getActiveDiscounts: () => Discount[];
  getDiscountedPrice: (product: Product) => number;
  discounts: Discount[];
  categories: ProductCategory[];
  addDiscount: (discount: Omit<Discount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDiscount: (discount: Discount) => void;
  deleteDiscount: (id: string) => void;
  getFilteredTransactions: () => Transaction[]; // New function to get role-filtered transactions
  canViewSensitiveData: () => boolean; // Check if user can view sensitive data
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const { toast } = useToast();
  const { currentUser, hasAdminAccess } = useAuth();
  const currencySymbol = '₵'; // Ghana Cedi symbol
  
  // Removed the mock currentUser as we're now using the one from AuthContext

  useEffect(() => {
    // Load data from localStorage if available or use sample data
    const storedProducts = localStorage.getItem('didiz-closet-products');
    const storedTransactions = localStorage.getItem('didiz-closet-transactions');
    const storedExpenses = localStorage.getItem('didiz-closet-expenses');
    const storedDiscounts = localStorage.getItem('didiz-closet-discounts');
    const storedCategories = localStorage.getItem('didiz-closet-categories');
    
    setProducts(storedProducts ? JSON.parse(storedProducts) : sampleProducts);
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : sampleTransactions);
    setExpenses(storedExpenses ? JSON.parse(storedExpenses) : sampleExpenses);
    setDiscounts(storedDiscounts ? JSON.parse(storedDiscounts) : []);
    setCategories(storedCategories ? JSON.parse(storedCategories) : sampleCategories);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem('didiz-closet-products', JSON.stringify(products));
    localStorage.setItem('didiz-closet-transactions', JSON.stringify(transactions));
    localStorage.setItem('didiz-closet-expenses', JSON.stringify(expenses));
    localStorage.setItem('didiz-closet-discounts', JSON.stringify(discounts));
    localStorage.setItem('didiz-closet-categories', JSON.stringify(categories));
  }, [products, transactions, expenses, discounts, categories]);

  // Function to get active discounts
  const getActiveDiscounts = () => {
    const now = new Date();
    return discounts.filter(discount => {
      // Check if discount is active
      if (!discount.active) return false;
      
      // Check date range if applicable
      const startValid = !discount.startDate || new Date(discount.startDate) <= now;
      const endValid = !discount.endDate || new Date(discount.endDate) >= now;
      
      return startValid && endValid;
    });
  };

  // Function to calculate the discounted price for a product
  const getDiscountedPrice = (product: Product) => {
    let finalPrice = product.sellingPrice;
    const activeDiscounts = getActiveDiscounts();
    
    activeDiscounts.forEach(discount => {
      // Check if discount applies to this product
      const isApplicable = 
        discount.applyToAll || 
        (discount.appliedProducts && discount.appliedProducts.includes(product.id)) ||
        (discount.appliedCategories && discount.appliedCategories.includes(product.category));
      
      if (isApplicable) {
        if (discount.type === 'percentage') {
          const discountAmount = finalPrice * (discount.value / 100);
          finalPrice -= discountAmount;
        } else if (discount.type === 'fixed') {
          finalPrice = Math.max(0, finalPrice - discount.value);
        }
      }
    });
    
    return finalPrice;
  };

  // Discount management functions
  const addDiscount = (discount: Omit<Discount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDiscount: Discount = {
      ...discount,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDiscounts([...discounts, newDiscount]);
    toast({
      title: "Discount Created",
      description: `${newDiscount.name} has been added to discounts`,
    });
  };

  const updateDiscount = (updatedDiscount: Discount) => {
    setDiscounts(
      discounts.map((discount) =>
        discount.id === updatedDiscount.id
          ? { ...updatedDiscount, updatedAt: new Date().toISOString() }
          : discount
      )
    );
    toast({
      title: "Discount Updated",
      description: `${updatedDiscount.name} has been updated`,
    });
  };

  const deleteDiscount = (id: string) => {
    const discountToDelete = discounts.find(d => d.id === id);
    if (discountToDelete) {
      setDiscounts(discounts.filter((discount) => discount.id !== id));
      toast({
        title: "Discount Deleted",
        description: `${discountToDelete.name} has been removed`,
        variant: "destructive",
      });
    }
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to inventory`,
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id
          ? { ...updatedProduct, updatedAt: new Date().toISOString() }
          : product
      )
    );
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated`,
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (productToDelete) {
      setProducts(products.filter((product) => product.id !== id));
      toast({
        title: "Product Deleted",
        description: `${productToDelete.name} has been removed from inventory`,
        variant: "destructive",
      });
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'priceDelta'>) => {
    const product = products.find((p) => p.id === transaction.productId);
    
    if (!product) {
      toast({
        title: "Transaction Failed",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    // Calculate price delta
    const priceDelta = transaction.actualPrice - transaction.originalPrice;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      priceDelta,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || 'unknown', // Use optional chaining since currentUser can be null
    };

    // Update the product quantity
    let newQuantity = product.quantity;
    if (transaction.type === 'sale') {
      newQuantity -= transaction.quantity;
    } else if (transaction.type === 'purchase') {
      newQuantity += transaction.quantity;
    } else if (transaction.type === 'adjustment') {
      newQuantity = Math.max(0, newQuantity + transaction.quantity); // Ensure non-negative
    }

    // Update the product
    const updatedProduct = {
      ...product,
      quantity: newQuantity,
      updatedAt: new Date().toISOString(),
    };

    setProducts(
      products.map((p) => (p.id === product.id ? updatedProduct : p))
    );
    setTransactions([...transactions, newTransaction]);

    toast({
      title: "Transaction Recorded",
      description: `${transaction.type === 'sale' ? 'Sale' : transaction.type === 'purchase' ? 'Purchase' : 'Adjustment'} of ${transaction.quantity} units processed.`,
    });

    // Check for low stock after transaction
    if (transaction.type === 'sale' && newQuantity <= product.lowStockThreshold) {
      toast({
        title: "Low Stock Alert",
        description: `${product.name} is running low on stock (${newQuantity} remaining)`,
        variant: "destructive",
      });
    }
  };

  // Function to check if user can view sensitive data
  const canViewSensitiveData = () => {
    return hasAdminAccess();
  };

  // Function to get filtered transactions based on user role
  const getFilteredTransactions = () => {
    // If user has admin access, show all transactions
    if (hasAdminAccess()) {
      return transactions;
    }
    
    // Otherwise, only show transactions created by this user
    return transactions.filter(transaction => 
      transaction.createdBy === currentUser?.id
    );
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([...expenses, newExpense]);
    toast({
      title: "Expense Recorded",
      description: `${newExpense.notes} has been added to expenses`,
    });
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    toast({
      title: "Expense Updated",
      description: `${updatedExpense.notes} has been updated`,
    });
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(e => e.id === id);
    if (expenseToDelete) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
      toast({
        title: "Expense Deleted",
        description: `${expenseToDelete.notes} has been removed`,
        variant: "destructive",
      });
    }
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const getLowStockProducts = () => {
    return products.filter((product) => product.quantity <= product.lowStockThreshold);
  };

  const getFinancialSummary = (startDate: Date, endDate: Date) => {
    // Filter transactions within date range
    let salesInPeriod = transactions.filter(
      t => t.type === 'sale' && 
      new Date(t.createdAt) >= startDate && 
      new Date(t.createdAt) <= endDate
    );

    // If user doesn't have admin access, only show their own transactions
    if (!hasAdminAccess()) {
      salesInPeriod = salesInPeriod.filter(t => t.createdBy === currentUser?.id);
    }

    // Calculate total sales
    const totalSales = salesInPeriod.reduce(
      (sum, t) => sum + t.totalAmount, 0
    );

    // Filter expenses within date range
    const expensesInPeriod = expenses.filter(
      e => new Date(e.date) >= startDate && 
      new Date(e.date) <= endDate
    );

    // Calculate total expenses
    const totalExpenses = expensesInPeriod.reduce(
      (sum, e) => sum + e.amount, 0
    );

    // Calculate profit
    const profit = totalSales - totalExpenses;

    // Get top selling products
    const productSales: Record<string, { quantity: number, revenue: number }> = {};
    
    salesInPeriod.forEach(sale => {
      const product = getProduct(sale.productId);
      if (!product) return;
      
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = { quantity: 0, revenue: 0 };
      }
      
      productSales[sale.productId].quantity += sale.quantity;
      productSales[sale.productId].revenue += sale.totalAmount;
    });
    
    const topSellingProducts = Object.entries(productSales)
      .map(([id, data]) => {
        const product = getProduct(id);
        return {
          name: product?.name || 'Unknown Product',
          quantity: data.quantity,
          revenue: data.revenue
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalSales,
      totalExpenses,
      profit,
      topSellingProducts
    };
  };

  const value = {
    products,
    transactions,
    expenses,
    discounts,
    categories,
    currentUser,
    currencySymbol,
    addProduct,
    updateProduct,
    deleteProduct,
    addTransaction,
    getProduct,
    getLowStockProducts,
    addExpense,
    updateExpense,
    deleteExpense,
    getFinancialSummary,
    getActiveDiscounts,
    getDiscountedPrice,
    addDiscount,
    updateDiscount,
    deleteDiscount,
    getFilteredTransactions,
    canViewSensitiveData,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
