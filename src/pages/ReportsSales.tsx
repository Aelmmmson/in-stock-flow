
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReportsSales = () => {
  const { transactions, products, currencySymbol } = useInventory();
  
  // Calculate total sales
  const salesTransactions = transactions.filter(t => t.type === 'sale');
  const totalSalesAmount = salesTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  
  // Calculate items sold
  const itemsSold = salesTransactions.reduce((sum, t) => sum + t.quantity, 0);
  
  // Calculate average transaction value
  const avgTransactionValue = salesTransactions.length > 0 
    ? totalSalesAmount / salesTransactions.length
    : 0;
    
  // Get top selling items
  const productSales: Record<string, { quantity: number, revenue: number }> = {};
  
  salesTransactions.forEach(transaction => {
    if (!productSales[transaction.productId]) {
      productSales[transaction.productId] = { quantity: 0, revenue: 0 };
    }
    
    productSales[transaction.productId].quantity += transaction.quantity;
    productSales[transaction.productId].revenue += transaction.totalAmount;
  });
  
  const topSellingItems = Object.entries(productSales)
    .map(([productId, data]) => ({ 
      productId,
      name: products.find(p => p.id === productId)?.name || 'Unknown Product',
      quantity: data.quantity,
      revenue: data.revenue
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <Tabs defaultValue="sales" className="w-full mt-4">
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <Link to="/reports">
              <TabsTrigger value="overview" className="w-full">Overview</TabsTrigger>
            </Link>
            <Link to="/reports/inventory">
              <TabsTrigger value="inventory" className="w-full">Inventory</TabsTrigger>
            </Link>
            <Link to="/reports/sales">
              <TabsTrigger value="sales" className="w-full">Sales</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <div className="h-6 w-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h2 className="text-base font-medium">Sales Summary</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Total Sales</div>
              <div className="text-lg font-bold">{currencySymbol}{totalSalesAmount.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Transactions</div>
              <div className="text-lg font-bold">{salesTransactions.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Items Sold</div>
              <div className="text-lg font-bold">{itemsSold}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg. Transaction</div>
              <div className="text-lg font-bold">{currencySymbol}{avgTransactionValue.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <div className="h-6 w-6 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                <path d="m12 8 6-3-6-3v10" />
                <path d="m8 5 4 2" />
                <path d="m8 9 4-2" />
                <rect width="16" height="6" x="4" y="15" rx="2" />
              </svg>
            </div>
            <h2 className="text-base font-medium">Top Selling Items</h2>
          </div>
          
          <div className="space-y-3 mt-4">
            {topSellingItems.length > 0 ? (
              topSellingItems.map((item, index) => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.quantity} units sold</div>
                  </div>
                  <div className="font-semibold">{currencySymbol}{item.revenue.toFixed(2)}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No sales data available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSales;
