
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Transaction, User } from '../types';
import { useToast } from '@/components/ui/use-toast';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Computer',
    sku: 'TECH-LAP-001',
    category: 'Electronics',
    supplier: 'TechSupplier Inc.',
    quantity: 15,
    purchaseCost: 800,
    sellingPrice: 1200,
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    variants: [
      { id: '1-1', name: 'Color', value: 'Silver' },
      { id: '1-2', name: 'RAM', value: '16GB' }
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
    name: 'Office Chair',
    sku: 'FURN-CHR-002',
    category: 'Furniture',
    supplier: 'Office Comfort Ltd.',
    quantity: 8,
    purchaseCost: 150,
    sellingPrice: 299.99,
    description: 'Ergonomic office chair with adjustable height and lumbar support',
    variants: [
      { id: '2-1', name: 'Color', value: 'Black' },
      { id: '2-2', name: 'Material', value: 'Mesh' }
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
    name: 'Wireless Headphones',
    sku: 'TECH-AUD-003',
    category: 'Electronics',
    supplier: 'AudioTech Co.',
    quantity: 2,
    purchaseCost: 75,
    sellingPrice: 129.99,
    description: 'Noise-cancelling wireless headphones with 30-hour battery life',
    variants: [
      { id: '3-1', name: 'Color', value: 'White' }
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
    originalPrice: 1200,
    actualPrice: 1150, // Slight discount given
    priceDelta: -50,
    totalAmount: 2300,
    type: 'sale',
    notes: 'Bulk purchase discount',
    createdAt: new Date().toISOString(),
    createdBy: '1',
  },
  {
    id: '2',
    productId: '3',
    quantity: 1,
    originalPrice: 129.99,
    actualPrice: 129.99,
    priceDelta: 0,
    totalAmount: 129.99,
    type: 'sale',
    notes: '',
    createdAt: new Date().toISOString(),
    createdBy: '1',
  }
];

interface InventoryContextType {
  products: Product[];
  transactions: Transaction[];
  currentUser: User;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'priceDelta'>) => void;
  getProduct: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
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
  const { toast } = useToast();
  
  // Mock current user
  const currentUser: User = {
    id: '1',
    name: 'Admin User',
    role: 'admin',
  };

  useEffect(() => {
    // Load data from localStorage if available or use sample data
    const storedProducts = localStorage.getItem('inventory-products');
    const storedTransactions = localStorage.getItem('inventory-transactions');
    
    setProducts(storedProducts ? JSON.parse(storedProducts) : sampleProducts);
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : sampleTransactions);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem('inventory-products', JSON.stringify(products));
    localStorage.setItem('inventory-transactions', JSON.stringify(transactions));
  }, [products, transactions]);

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

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const getLowStockProducts = () => {
    return products.filter((product) => product.quantity <= product.lowStockThreshold);
  };

  const value = {
    products,
    transactions,
    currentUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addTransaction,
    getProduct,
    getLowStockProducts,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
