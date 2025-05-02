
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { Package, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { products, transactions, getLowStockProducts } = useInventory();
  const lowStockProducts = getLowStockProducts();

  // Calculate total inventory value
  const totalInventoryValue = products.reduce(
    (acc, product) => acc + product.quantity * product.sellingPrice, 
    0
  );

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <Link 
              to="/inventory" 
              className="text-xs text-blue-600 hover:underline"
            >
              View all products
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Items below threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalInventoryValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              At selling price
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Sales
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${recentSales.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
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
                          ${transaction.totalAmount.toFixed(2)}
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
