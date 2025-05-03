
import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const { products, currencySymbol } = useInventory();
  const [search, setSearch] = useState('');

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="icon" variant="outline">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/inventory/${product.id}`}>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="font-medium">{product.name}</div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">SKU</div>
                  <div className="text-xs text-right">{product.sku}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
                  <div className="text-xs text-right">{product.category}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Quantity</div>
                  <div className={`text-xs text-right ${product.quantity <= product.lowStockThreshold ? 'text-amber-500 font-medium' : ''}`}>
                    {product.quantity}
                    {product.quantity <= product.lowStockThreshold && ' ⚠️'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Price</div>
                  <div className="text-xs text-right font-medium">{currencySymbol}{product.sellingPrice.toFixed(2)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}

      <Button
        className="fixed bottom-20 right-4 rounded-full h-14 w-14 shadow-lg bg-pink-500 hover:bg-pink-600"
        size="icon"
        asChild
      >
        <Link to="/inventory/add">
          <Plus className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  );
};

export default Inventory;
