
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowDownRight, FileText } from 'lucide-react';

const Reports = () => {
  const { products, transactions, expenses, currencySymbol } = useInventory();
  
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

  // Total expenses
  const totalExpenses = expenses.reduce((total, exp) => total + exp.amount, 0);

  // Chart data
  const chartData = Object.entries(categoryDistribution).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/expenses">
              <FileText className="mr-2 h-4 w-4" />
              Manage Expenses
            </Link>
          </Button>
          <Button asChild>
            <Link to="/reports/financial">
              <FileText className="mr-2 h-4 w-4" />
              View Financial Reports
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Valuation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost Value</p>
                <p className="text-2xl font-bold">{currencySymbol}{totalInventoryCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Retail Value</p>
                <p className="text-2xl font-bold">{currencySymbol}{totalInventoryValue.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential Profit</p>
              <p className="text-2xl font-bold text-green-600">{currencySymbol}{potentialProfit.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">{currencySymbol}{totalSales.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{currencySymbol}{totalExpenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className={`text-2xl font-bold ${totalSales - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currencySymbol}{(totalSales - totalExpenses).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Inventory by Category</CardTitle>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {Object.values(categoryDistribution).reduce((a, b) => a + b, 0)} total items
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={70}
                  />
                  <YAxis />
                  <Bar dataKey="count" name="Items" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <ChartTooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Price Adjustments Summary</CardTitle>
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {totalPriceAdjustments < 0 ? 'Total discounts given' : 'Total price increases'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Price Adjustments</p>
              <p className={`text-2xl font-bold ${totalPriceAdjustments < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {totalPriceAdjustments < 0 ? '-' : '+'}
                {currencySymbol}
                {Math.abs(totalPriceAdjustments).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalPriceAdjustments < 0 
                  ? 'Total discounts given to customers'
                  : 'Total price increases from original prices'
                }
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Analysis</h3>
              <p className="text-muted-foreground text-sm">
                {totalPriceAdjustments < 0 
                  ? `Discounts represent ${((Math.abs(totalPriceAdjustments) / totalSales) * 100).toFixed(1)}% of total sales. Consider reviewing pricing strategy.`
                  : `Price increases represent ${((totalPriceAdjustments / totalSales) * 100).toFixed(1)}% of total sales. Your pricing strategy is effective.`
                }
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Link to="/reports/financial" className="text-blue-600 hover:underline text-sm flex items-center">
              <span>View detailed financial reports</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
