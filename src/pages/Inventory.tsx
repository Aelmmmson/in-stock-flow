
import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const Inventory = () => {
  const { products, currencySymbol, getActiveDiscounts, getDiscountedPrice } = useInventory();
  const [search, setSearch] = useState('');
  const activeDiscounts = getActiveDiscounts();

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  // Get applicable discounts for a specific product
  const getApplicableDiscounts = (product) => {
    return activeDiscounts.filter(discount => 
      discount.applyToAll || 
      (discount.appliedProducts && discount.appliedProducts.includes(product.id)) ||
      (discount.appliedCategories && discount.appliedCategories.includes(product.category))
    );
  };

  return (
    <ScrollArea className="h-full scrollbar-none">
      <div className="space-y-6 pb-20">
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
            {filteredProducts.map((product) => {
              const applicableDiscounts = getApplicableDiscounts(product);
              const finalPrice = getDiscountedPrice(product);
              const hasDiscount = finalPrice < product.sellingPrice;
              const totalDiscount = product.sellingPrice - finalPrice;
              const discountPercentage = Math.round((totalDiscount / product.sellingPrice) * 100);
              
              return (
                <Link key={product.id} to={`/inventory/${product.id}`}>
                  <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 mb-3">
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">SKU</div>
                      <div className="text-xs text-right text-gray-300">{product.sku}</div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
                      <div className="text-xs text-right text-gray-300">{product.category}</div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">Quantity</div>
                      <div className={`text-xs text-right ${product.quantity <= product.lowStockThreshold ? 'text-amber-500 font-medium' : 'text-gray-300'}`}>
                        {product.quantity}
                        {product.quantity <= product.lowStockThreshold && ' ⚠️'}
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">Regular Price</div>
                      <div className={`text-xs text-right ${hasDiscount ? 'line-through text-gray-400' : 'font-medium text-white'}`}>
                        {currencySymbol}{product.sellingPrice.toFixed(2)}
                      </div>
                      
                      {/* Show active discounts if any */}
                      {applicableDiscounts.length > 0 && (
                        <>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Active Discounts</div>
                          <div className="text-xs text-right">
                            {applicableDiscounts.map((discount, idx) => (
                              <Badge key={idx} variant="outline" className="bg-pink-500/20 text-pink-300 border-pink-500 mb-1 ml-1">
                                <Tag className="h-3 w-3 mr-1" /> 
                                {discount.type === 'percentage' ? `${discount.value}% off` : `${currencySymbol}${discount.value} off`}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {/* Show final price after all discounts */}
                      {hasDiscount && (
                        <>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Final Price</div>
                          <div className="text-xs text-right font-medium text-green-400">
                            {currencySymbol}{finalPrice.toFixed(2)} 
                            <span className="ml-1 text-xs">(-{discountPercentage}%)</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
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
    </ScrollArea>
  );
};

export default Inventory;
