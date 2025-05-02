
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';

const Reports = () => {
  const { products, transactions } = useInventory();
  
  // Calculate total inventory value
  const totalInventoryValue = products.reduce(
    (acc, product) => acc + product.quantity * product.sellingPrice,
    0
  );
  
  const totalInventoryCost = products.reduce(
    (acc, product) => acc + product.quantity * product.purchaseCost,
    0
  );
  
  // Calculate potential profit
  const potentialProfit = totalInventoryValue - totalInventoryCost;
  
  // Calculate sales data
  const salesTransactions = transactions.filter(t => t.type === 'sale');
  const totalSales = salesTransactions.reduce(
    (acc, t) => acc + t.totalAmount,
    0
  );
  
  // Calculate price adjustments
  const totalPriceAdjustments = salesTransactions.reduce(
    (acc, t) => acc + t.priceDelta,
    0
  );

  // Category distribution
  const categoryDistribution: Record<string, number> = {};
  products.forEach(product => {
    if (!categoryDistribution[product.category]) {
      categoryDistribution[product.category] = 0;
    }
    categoryDistribution[product.category] += product.quantity;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Valuation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost Value</p>
                <p className="text-2xl font-bold">${totalInventoryCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Retail Value</p>
                <p className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential Profit</p>
              <p className="text-2xl font-bold text-green-600">${potentialProfit.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Price Adjustments</p>
              <p className={`text-2xl font-bold ${totalPriceAdjustments < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {totalPriceAdjustments < 0 ? '-' : '+'}${Math.abs(totalPriceAdjustments).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalPriceAdjustments < 0 
                  ? 'Total discounts given to customers'
                  : 'Total price increases from original prices'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(categoryDistribution).map(category => {
                const percentage = 
                  (categoryDistribution[category] / 
                   Object.values(categoryDistribution).reduce((a, b) => a + b, 0)) * 100;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">
                        {categoryDistribution[category]} items ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-center text-muted-foreground">
          Advanced reporting and analytics features coming soon.
        </p>
      </div>
    </div>
  );
};

export default Reports;
