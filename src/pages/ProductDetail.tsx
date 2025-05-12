
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, currencySymbol, canViewSensitiveData } = useInventory();
  
  const [product, setProduct] = useState(products.find(p => p.id === id));
  
  useEffect(() => {
    if (!product) {
      toast({
        title: "Product not found",
        description: "The product you're looking for doesn't exist",
        variant: "destructive",
      });
      navigate('/inventory');
    }
  }, [product, navigate, toast]);
  
  if (!product) return null;
  
  const profit = product.sellingPrice - product.purchaseCost;
  const profitMargin = (profit / product.sellingPrice) * 100;
  
  // Check low stock status
  const isLowStock = product.quantity <= product.lowStockThreshold;
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 object-cover rounded-lg mx-auto"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <img 
              src="/lovable-uploads/3f572e8f-ea1f-471d-b011-9a3eb36a100e.png" 
              alt={product.name} 
              className="w-48 h-48 object-contain opacity-70"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          className="bg-pink-500 hover:bg-pink-600" 
          asChild
        >
          <Link to={`/inventory/${product.id}/barcode`}>
            Generate Barcode
          </Link>
        </Button>
        
        <Button 
          className="bg-purple-500 hover:bg-purple-600"
          onClick={() => navigate('/transactions/add')}
        >
          Quick Sale
        </Button>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{product.name}</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">SKU</span>
            <span>{product.sku}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Category</span>
            <span>{product.category}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Supplier</span>
            <span>{product.supplier || 'Not specified'}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium">Inventory</h3>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Current Stock</span>
            <span className={isLowStock ? 'text-amber-500 font-medium' : ''}>{product.quantity} {isLowStock && '⚠️'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Low Stock Threshold</span>
            <span>{product.lowStockThreshold}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium">Pricing</h3>
          
          {canViewSensitiveData() && (
            <div className="flex justify-between">
              <span className="text-gray-500">Purchase Cost</span>
              <span>{currencySymbol}{product.purchaseCost.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-500">Selling Price</span>
            <span>{currencySymbol}{product.sellingPrice.toFixed(2)}</span>
          </div>
          
          {canViewSensitiveData() && (
            <div className="flex justify-between">
              <span className="text-gray-500">Profit Margin</span>
              <span className="text-green-600">{profitMargin.toFixed(2)}%</span>
            </div>
          )}
        </div>
        
        {product.description && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
            </div>
          </>
        )}
      </div>
      
      <div className="pt-4 flex space-x-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => navigate(`/inventory/${product.id}/edit`)}
        >
          Edit Item
        </Button>
        
        <Button 
          className="flex-1 bg-pink-500 hover:bg-pink-600"
          onClick={() => navigate('/transactions/add')}
        >
          Sell Item
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
