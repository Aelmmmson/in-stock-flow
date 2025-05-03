
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Reports = () => {
  const { products, transactions, currencySymbol } = useInventory();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate total inventory value at cost
  const inventoryValue = products.reduce(
    (acc, product) => acc + product.quantity * product.purchaseCost,
    0
  );
  
  // Calculate total inventory value at retail price
  const retailValue = products.reduce(
    (acc, product) => acc + product.quantity * product.sellingPrice,
    0
  );
  
  // Calculate potential profit
  const potentialProfit = retailValue - inventoryValue;
  
  // Calculate total sales
  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((acc, t) => acc + t.totalAmount, 0);
    
  // Calculate total price adjustments
  const totalPriceAdjustments = transactions
    .filter(t => t.type === 'sale')
    .reduce((acc, t) => acc + t.priceDelta, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            if (value !== 'overview') {
              navigate(`/reports/${value}`);
            }
          }} 
          className="w-full mt-4"
        >
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="overview" className="w-full">Overview</TabsTrigger>
            <TabsTrigger value="inventory" className="w-full">Inventory</TabsTrigger>
            <TabsTrigger value="sales" className="w-full">Sales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="h-5 w-5 bg-pink-100 dark:bg-pink-900/30 rounded-md flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
                  </div>
                  <h2 className="text-sm font-medium">Financial Overview</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Inventory Value</div>
                    <div className="text-lg font-bold">GH₵{inventoryValue.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Retail Value</div>
                    <div className="text-lg font-bold">GH₵{retailValue.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Potential Profit</div>
                    <div className="text-lg font-bold text-green-600">GH₵{potentialProfit.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Sales</div>
                    <div className="text-lg font-bold">GH₵{totalSales.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="h-5 w-5 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center mr-2">
                    <span className="text-purple-500 text-sm font-bold">$</span>
                  </div>
                  <h2 className="text-sm font-medium">Price Adjustments</h2>
                </div>
                
                <div className="mt-2">
                  <div className="text-xs mb-1">Total Price Adjustments</div>
                  <div className={`text-lg font-bold ${totalPriceAdjustments < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {totalPriceAdjustments === 0 ? 'GH₵0.00' : `${totalPriceAdjustments > 0 ? '+' : ''}GH₵${totalPriceAdjustments.toFixed(2)}`}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your price adjustments have {totalPriceAdjustments < 0 ? 'decreased' : 'increased'} revenue
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
