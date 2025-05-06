import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Transaction, User, Expense } from '../types';
import { useToast } from '@/components/ui/use-toast';

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
    actualPrice: 140, // Slight discount given
    priceDelta: -10,
    totalAmount: 280,
    type: 'sale',
    notes: 'Loyal customer discount',
    createdAt: new Date().toISOString(),
    createdBy: '1',
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
    frequency: 'monthly'
  },
  {
    id: '2',
    category: 'Utilities',
    amount: 250,
    notes: 'Electricity and water bill',
    date: new Date().toISOString(),
    paymentMethod: 'Cash',
    recurring: true,
    frequency: 'monthly'
  },
  {
    id: '3',
    category: 'Salaries',
    amount: 1800,
    notes: 'Staff salaries',
    date: new Date().toISOString(),
    paymentMethod: 'Bank Transfer',
    recurring: true,
    frequency: 'monthly'
  }
];

interface InventoryContextType {
  products: Product[];
  transactions: Transaction[];
  expenses: Expense[];
  currentUser: User;
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
  const { toast } = useToast();
  const currencySymbol = '₵'; // Ghana Cedi symbol
  
  // Mock current user
  const currentUser: User = {
    id: '1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@didizcloset.com'
  };

  useEffect(() => {
    // Load data from localStorage if available or use sample data
    const storedProducts = localStorage.getItem('didiz-closet-products');
    const storedTransactions = localStorage.getItem('didiz-closet-transactions');
    const storedExpenses = localStorage.getItem('didiz-closet-expenses');
    
    setProducts(storedProducts ? JSON.parse(storedProducts) : sampleProducts);
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : sampleTransactions);
    setExpenses(storedExpenses ? JSON.parse(storedExpenses) : sampleExpenses);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem('didiz-closet-products', JSON.stringify(products));
    localStorage.setItem('didiz-closet-transactions', JSON.stringify(transactions));
    localStorage.setItem('didiz-closet-expenses', JSON.stringify(expenses));
  }, [products, transactions, expenses]);

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
    const salesInPeriod = transactions.filter(
      t => t.type === 'sale' && 
      new Date(t.createdAt) >= startDate && 
      new Date(t.createdAt) <= endDate
    );

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
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
