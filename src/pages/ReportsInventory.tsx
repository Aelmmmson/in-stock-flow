
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReportsInventory = () => {
  const navigate = useNavigate();
  const { products, getLowStockProducts, canViewSensitiveData } = useInventory();
  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = products.filter(p => p.quantity === 0);
  
  // Get unique categories and count items in each
  const categories: Record<string, number> = {};
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = 0;
    }
    categories[product.category]++;
  });

  // For non-admin users, show restricted view
  if (!canViewSensitiveData()) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory Reports</h1>
        </div>
        
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <ShieldAlert className="h-5 w-5 text-amber-500 mr-2" />
              <h2 className="text-base font-medium">Restricted Access</h2>
            </div>
            
            <p className="text-sm text-gray-500">
              You don't have permission to view detailed inventory reports. 
              This information is restricted to administrators and managers.
            </p>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              className="mt-4"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <Tabs defaultValue="inventory" className="w-full mt-4">
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
            <div className="h-6 w-6 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0" />
                <path d="M2 9h20" />
              </svg>
            </div>
            <h2 className="text-base font-medium">Inventory Status</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold">{products.length}</div>
              <div className="text-xs text-gray-500 mt-1">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-amber-500">{lowStockProducts.length}</div>
              <div className="text-xs text-gray-500 mt-1">Low Stock Items</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-500">{outOfStockProducts.length}</div>
              <div className="text-xs text-gray-500 mt-1">Out of Stock</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <div className="h-6 w-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <path d="M3 5v14h18V5H3Z" />
                <path d="M21 8H3" />
                <path d="M6 5v14" />
              </svg>
            </div>
            <h2 className="text-base font-medium">Category Breakdown</h2>
          </div>
          
          <div className="space-y-3 mt-4">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <div>{category}</div>
                <div className="text-sm text-gray-500">{count} items</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsInventory;
