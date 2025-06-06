
import { Box, ShoppingCart, TrendingUp, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBranch } from '@/contexts/BranchContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import BranchSelector from '@/components/layout/BranchSelector';

const Dashboard = () => {
  const {
    products,
    getFilteredTransactions,
    getLowStockProducts,
    currencySymbol,
    canViewSensitiveData
  } = useInventory();
  
  const { currentUser, hasAdminAccess } = useAuth();
  const { canSwitchBranches } = useBranch();
  const lowStockProducts = getLowStockProducts();
  
  // Get transactions filtered by user role
  const transactions = getFilteredTransactions();

  // Get sales transactions
  const salesTransactions = transactions.filter(t => t.type === 'sale');

  // Calculate total inventory value
  const inventoryValue = products.reduce((acc, product) => acc + product.quantity * product.purchaseCost, 0);

  // Calculate total inventory value at retail price
  const retailValue = products.reduce((acc, product) => acc + product.quantity * product.sellingPrice, 0);

  // Calculate potential profit
  const potentialProfit = retailValue - inventoryValue;

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Branch Selector for Owners */}
      {canSwitchBranches() && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Branch View</h2>
            <BranchSelector />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Only show Add Item button for users with admin access */}
        {hasAdminAccess() && (
          <Button onClick={() => window.location.href = '/inventory/add'} className="bg-pink-500 hover:bg-pink-600 flex items-center justify-center py-3">
            <span className="mr-1">+</span> Add Item
          </Button>
        )}
        
        <Button onClick={() => window.location.href = '/transactions/add'} className="bg-purple-500 hover:bg-purple-600 flex items-center justify-center py-3">
          <span className="mr-1">+</span> New Sale
        </Button>
        
        {hasAdminAccess() && (
          <Button 
            onClick={() => window.location.href = '/discounts'} 
            className="bg-green-500 hover:bg-green-600 flex items-center justify-center py-3"
          >
            <Tag className="h-4 w-4 mr-1" />
            <span>Discounts</span>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <Link to="/inventory" className="block">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 w-12 h-12 flex items-center justify-center mx-auto">
              <Box className="h-6 w-6 text-pink-500" />
            </div>
            <div className="mt-3 text-gray-500 dark:text-gray-400">Total Items</div>
            <div className="text-2xl font-bold">{products.length}</div>
          </div>
        </Link>
        
        {canViewSensitiveData() ? (
          <Link to="/reports/financial" className="block">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 w-12 h-12 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div className="mt-3 text-gray-500 dark:text-gray-400">Potential Profit</div>
              <div className="text-2xl md:text-2xl text-sm font-bold">{currencySymbol}{potentialProfit.toFixed(2)}</div>
            </div>
          </Link>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 w-12 h-12 flex items-center justify-center mx-auto">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="mt-3 text-gray-500 dark:text-gray-400">Your Sales</div>
            <div className="text-2xl md:text-2xl text-sm font-bold">{currencySymbol}{salesTransactions.reduce((sum, t) => sum + t.totalAmount, 0).toFixed(2)}</div>
          </div>
        )}
        
        <Link to="/transactions" className="block">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 w-12 h-12 flex items-center justify-center mx-auto">
              <ShoppingCart className="h-6 w-6 text-purple-500" />
            </div>
            <div className="mt-3 text-gray-500 dark:text-gray-400">Sales</div>
            <div className="text-2xl font-bold">{salesTransactions.length}</div>
          </div>
        </Link>
      </div>

      {canViewSensitiveData() && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold">Low Stock Alerts</h3>
          </div>
          
          <div className="divide-y">
            {lowStockProducts.length > 0 ? lowStockProducts.map(product => (
              <Link key={product.id} to={`/inventory/${product.id}`} className="flex items-center justify-between py-3">
                <div className="text-gray-800 dark:text-gray-200">{product.name}</div>
                <div className="text-amber-600 dark:text-amber-400 font-semibold">
                  {product.quantity} left
                </div>
              </Link>
            )) : (
              <div className="py-3 text-gray-500 dark:text-gray-400">
                No low stock items
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="h-5 w-5 text-purple-500" />
          <h3 className="font-bold">Recent Sales</h3>
          {!canViewSensitiveData() && currentUser && (
            <span className="text-xs text-gray-500 ml-2">
              (Made by you)
            </span>
          )}
        </div>
        
        <div className="divide-y">
          {transactions.length > 0 ? transactions.filter(t => t.type === 'sale').slice(0, 3).map(transaction => {
            const product = products.find(p => p.id === transaction.productId);
            return (
              <Link key={transaction.id} to={`/transactions/${transaction.id}`} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {formatDate(transaction.createdAt)}
                  </div>
                  <div className="text-gray-800 dark:text-gray-200">
                    #{transaction.id.substring(0, 7)}
                  </div>
                </div>
                <div className="font-semibold">
                  {currencySymbol}{transaction.totalAmount.toFixed(2)}
                </div>
              </Link>
            );
          }) : (
            <div className="py-3 text-gray-500 dark:text-gray-400">
              No recent sales
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
