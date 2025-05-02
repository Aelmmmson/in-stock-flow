
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
        <h1 className="text-2xl font-bold">Low Stock Alerts</h1>
        <Link to="/inventory">
          <Button variant="outline">Back to Inventory</Button>
        </Link>
      </div>

      {lowStockProducts.length > 0 ? (
        <Card>
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span>{lowStockProducts.length} items require attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Current Stock</TableHead>
                  <TableHead className="text-center">Threshold</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-center font-medium text-red-600 dark:text-red-400">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {product.lowStockThreshold}
                    </TableCell>
                    <TableCell className="text-right">
                      {currencySymbol}{product.sellingPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/inventory/${product.id}/barcode`}>Barcode</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/inventory/${product.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
