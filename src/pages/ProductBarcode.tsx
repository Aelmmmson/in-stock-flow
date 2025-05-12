
import { useParams, Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import BarcodeGenerator from '@/components/inventory/BarcodeGenerator';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const ProductBarcode = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, canViewSensitiveData } = useInventory();
  
  const product = getProduct(id || '');

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
        <Button asChild>
          <Link to="/inventory">Back to Inventory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button 
          variant="ghost" 
          asChild
          className="mb-6"
        >
          <Link to="/inventory">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">SKU: {product.sku}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BarcodeGenerator 
            productName={product.name} 
            productSku={product.sku} 
            productPrice={product.sellingPrice} 
          />
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Product Information</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Supplier</p>
                <p className="font-medium">{product.supplier}</p>
              </div>
              <div>
                <p className="text-gray-500">Quantity</p>
                <p className="font-medium">{product.quantity} units</p>
              </div>
              <div>
                <p className="text-gray-500">Selling Price</p>
                <p className="font-medium">${product.sellingPrice.toFixed(2)}</p>
              </div>
              {canViewSensitiveData() && (
                <div>
                  <p className="text-gray-500">Purchase Cost</p>
                  <p className="font-medium">${product.purchaseCost.toFixed(2)}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Tax Rate</p>
                <p className="font-medium">{product.taxRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Instructions</h3>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Click "Print Barcode" to print a physical copy</li>
              <li>Click "Save as Image" to download the barcode as an image</li>
              <li>You can scan this barcode with most modern barcode scanners</li>
              <li>The barcode contains the product SKU, name and price information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBarcode;
