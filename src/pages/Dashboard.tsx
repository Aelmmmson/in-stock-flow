
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { Package2, AlertTriangle, TrendingUp, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  // Calculate recent sales (last month)
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const recentSales = transactions
    .filter(t => 
      t.type === 'sale' && 
      new Date(t.createdAt) >= lastMonth
    )
    .reduce((acc, t) => acc + t.totalAmount, 0);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get product name
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="card-gradient border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-500">
              <Package2 className="h-4 w-4" />
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
              Potential Profit
            </CardTitle>
            <div className="rounded-full bg-green-500/20 p-2 text-green-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {currencySymbol}{potentialProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              At current prices
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ScrollArea className="max-h-48 overflow-y-auto scrollbar-none">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map(product => (
                    <Link 
                      key={product.id}
                      to={`/inventory/${product.id}`}
                      className="flex items-center justify-between border-b pb-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md"
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
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground p-2">
                  No low stock items at the moment.
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-purple-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ScrollArea className="max-h-48 overflow-y-auto scrollbar-none">
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map(transaction => {
                    const product = products.find(p => p.id === transaction.productId);
                    
                    return (
                      <Link 
                        key={transaction.id}
                        to={`/transactions/${transaction.id}`}
                        className="flex items-center justify-between border-b pb-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md"
                      >
                        <div>
                          <p className="font-medium">
                            {getProductName(transaction.productId)}
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
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground p-2">
                  No recent transactions.
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
