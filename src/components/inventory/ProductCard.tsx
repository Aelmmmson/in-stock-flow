
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Barcode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  const isLowStock = product.quantity <= product.lowStockThreshold;
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 bg-gray-100">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          {isLowStock ? (
            <Badge variant="destructive" className="ml-2">Low Stock</Badge>
          ) : (
            <Badge variant="outline" className="ml-2">In Stock</Badge>
          )}
        </div>
        
        <div className="text-sm text-gray-500 mb-2">SKU: {product.sku}</div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <div className="text-gray-500">Price</div>
            <div className="font-semibold">${product.sellingPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-500">Quantity</div>
            <div className={`font-semibold ${isLowStock ? 'text-red-500' : ''}`}>
              {product.quantity} units
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t flex justify-between gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/inventory/${product.id}/barcode`}>
            <Barcode className="h-4 w-4 mr-2" />
            Barcode
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" size="icon" className="h-9 w-9">
            <Link to={`/inventory/${product.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 text-red-500"
            onClick={() => onDelete(product.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
