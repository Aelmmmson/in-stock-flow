
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShoppingCart, ChevronLeft, Printer } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import BarcodeGenerator from '@/components/inventory/BarcodeGenerator';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

const ScanProduct = () => {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const { products, currencySymbol } = useInventory();
  const [product, setProduct] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Find product by SKU
    if (sku) {
      const foundProduct = products.find(p => p.sku === sku);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error("Product not found");
        navigate('/inventory');
      }
    }
  }, [sku, products, navigate]);
  
  const handleAddToCart = () => {
    if (product) {
      navigate('/transactions/add', { state: { productToAdd: product.id } });
    }
  };
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Barcode-${product?.sku || 'product'}`,
    onPrintError: () => toast.error("Printing failed"),
  });
  
  if (!product) return null;
  
  return (
    <ScrollArea className="h-full scrollbar-none">
      <div className="space-y-6 pb-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <h1 className="text-xl font-bold">Scanned Product</h1>
        
        <Card className="p-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-semibold">{currencySymbol}{product.sellingPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock</p>
                <p className={product.quantity <= product.lowStockThreshold ? "text-amber-600 font-medium" : ""}>
                  {product.quantity} {product.quantity <= product.lowStockThreshold && '⚠️'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supplier</p>
                <p>{product.supplier || 'Not specified'}</p>
              </div>
            </div>
            
            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Variants</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.variants.map((variant: any) => (
                    <span 
                      key={variant.id} 
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                    >
                      {variant.name}: {variant.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <div ref={printRef} className="mb-4">
          <BarcodeGenerator
            productName={product.name}
            productSku={product.sku}
            productPrice={product.sellingPrice}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="w-full"
          >
            <Printer className="h-4 w-4 mr-2" /> Print Barcode
          </Button>
          
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ScanProduct;
