
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProduct } = useInventory();
  
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !sku || !category || !quantity || !purchaseCost || !sellingPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newProduct = {
      id: crypto.randomUUID(),
      name,
      sku,
      category,
      quantity: parseInt(quantity, 10),
      lowStockThreshold: parseInt(lowStockThreshold, 10),
      purchaseCost: parseFloat(purchaseCost),
      sellingPrice: parseFloat(sellingPrice),
      description,
      supplier,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addProduct(newProduct);
    
    toast({
      title: "Product added",
      description: `${name} has been added to your inventory`,
    });
    
    navigate('/inventory');
  };

  return (
    <div className="space-y-8">
      <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <Camera className="h-6 w-6 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Add Product image</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="product-name">Product Name *</Label>
            <Input
              id="product-name"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              placeholder="Enter SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              placeholder="Enter supplier name"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Low Stock Threshold</h2>
        <Input
          type="number"
          min="1"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
        />
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Pricing</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="purchase-cost">Purchase Cost (GH₵) *</Label>
            <Input
              id="purchase-cost"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter cost"
              value={purchaseCost}
              onChange={(e) => setPurchaseCost(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="selling-price">Selling Price (GH₵) *</Label>
            <Input
              id="selling-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="quantity">Initial Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Description</h2>
        <Textarea
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="pt-4">
        <Button
          type="button"
          className="w-full bg-pink-500 hover:bg-pink-600"
          onClick={handleSubmit}
        >
          Save Product
        </Button>
      </div>
    </div>
  );
};

export default AddProduct;
