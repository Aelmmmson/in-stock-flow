
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { FileText, AlertTriangle, TrendingUp, Package, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { products, transactions, getLowStockProducts, currencySymbol } = useInventory();
  const lowStockProducts = getLowStockProducts();
  
  // Get sales transactions
  const salesTransactions = transactions.filter(t => t.type === 'sale');

  // Calculate total inventory value
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
  
  // Calculate recent sales (last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const recentSales = transactions
    .filter(t => 
      t.type === 'sale' && 
      new Date(t.createdAt) >= lastWeek
    )
    .reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="card-gradient border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-500">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{products.length}</div>
            <Link 
              to="/inventory" 
              className="text-xs text-blue-600 hover:underline"
            >
              View all products
            </Link>
          </CardContent>
        </Card>

        <Card className="card-gradient border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales
            </CardTitle>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 text-purple-500">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{salesTransactions.length}</div>
            <Link 
              to="/transactions" 
              className="text-xs text-purple-600 hover:underline"
            >
              View all sales
            </Link>
          </CardContent>
        </Card>

        <Card className="card-gradient border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock
            </CardTitle>
            <div className="rounded-full bg-amber-500/20 p-2 text-amber-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Items below threshold
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue
            </CardTitle>
            <div className="rounded-full bg-green-500/20 p-2 text-green-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {currencySymbol}{recentSales.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map(product => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-destructive font-semibold">
                        {product.quantity} left
                      </span>
                      <Link 
                        to={`/inventory/${product.id}`}
                        className="ml-4 text-xs text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No low stock items at the moment.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 5).map(transaction => {
                  const product = products.find(p => p.id === transaction.productId);
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">
                          {product?.name || 'Unknown Product'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type === 'sale' ? 'Sold' : 
                           transaction.type === 'purchase' ? 'Purchased' : 
                           'Adjusted'} {transaction.quantity} units
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {currencySymbol}{transaction.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No recent transactions.
              </p>
            )}
            
            <div className="mt-4">
              <Link 
                to="/transactions"
                className="text-sm text-blue-600 hover:underline"
              >
                View all transactions
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
