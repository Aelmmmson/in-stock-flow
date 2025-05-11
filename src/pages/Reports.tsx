
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown, ChevronRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

const Reports = () => {
  const { products, currencySymbol, canViewSensitiveData, getFilteredTransactions } = useInventory();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductAnalysis, setShowProductAnalysis] = useState(false);
  
  // Get transactions filtered by role
  const transactions = getFilteredTransactions();

  // Redirect non-admin users if they try to access this page directly
  if (!canViewSensitiveData() && !currentUser) {
    navigate('/dashboard');
    return null;
  }
  
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

  // If user doesn't have admin access, show limited reports
  if (!canViewSensitiveData()) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Your Sales Reports</h1>
        </div>
        
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="h-5 w-5 bg-pink-100 dark:bg-pink-900/30 rounded-md flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
              </div>
              <h2 className="text-sm font-medium">Your Sales Overview</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Your Total Sales</div>
                <div className="text-lg font-bold">GH₵{totalSales.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Number of Transactions</div>
                <div className="text-lg font-bold">{transactions.filter(t => t.type === 'sale').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center">
              <ShieldAlert className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle>Access Limited</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              You don't have permission to view detailed financial reports. 
              Please contact your administrator for more information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ProductAnalysisContent = () => (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Product Profitability Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[600px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Profit/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => {
                  const totalCost = product.quantity * product.purchaseCost;
                  const totalValue = product.quantity * product.sellingPrice;
                  const profit = totalValue - totalCost;
                  const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{currencySymbol}{product.purchaseCost.toFixed(2)}</TableCell>
                      <TableCell>{currencySymbol}{product.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>{currencySymbol}{totalCost.toFixed(2)}</TableCell>
                      <TableCell>{currencySymbol}{totalValue.toFixed(2)}</TableCell>
                      <TableCell className={`${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <div className="flex items-center">
                          {profit >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                          {currencySymbol}{Math.abs(profit).toFixed(2)}
                          <span className="ml-1 text-xs">
                            ({profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}%)
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
        
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="font-bold">{currencySymbol}{inventoryValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="font-bold">{currencySymbol}{retailValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Profit</p>
              <p className={`font-bold ${potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currencySymbol}{potentialProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            if (value === "product-analysis") {
              setShowProductAnalysis(true);
              setActiveTab("overview");
            } else {
              setActiveTab(value);
              if (value !== 'overview') {
                navigate(`/reports/${value}`);
              }
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

            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center mt-4"
              onClick={() => setShowProductAnalysis(true)}
            >
              <span>View Product Analysis</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {showProductAnalysis && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">Product Analysis</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowProductAnalysis(false)}
              >
                Close
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-60px)]">
              <ProductAnalysisContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
