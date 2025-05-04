
import { Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const LowStockItems = () => {
  const { getLowStockProducts, currencySymbol } = useInventory();
  const lowStockProducts = getLowStockProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Low Stock Alerts</h1>
        <Link to="/inventory">
          <Button variant="outline">Back to Inventory</Button>
        </Link>
      </div>

      {lowStockProducts.length > 0 ? (
        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <Link
              key={product.id}
              to={`/inventory/${product.id}`}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-destructive font-semibold text-lg">
                        {product.quantity} left
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Threshold: {product.lowStockThreshold}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium">All Products In Stock</h3>
            <p className="text-muted-foreground">
              You don't have any products below their minimum stock threshold.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
        <h3 className="text-amber-800 dark:text-amber-400 font-medium mb-2">Looking to restock?</h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm">
          You can add purchase transactions to update your inventory levels. 
          <Link to="/transactions/add" className="ml-1 underline">
            Add a purchase transaction
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LowStockItems;
