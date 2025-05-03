
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, X, Upload } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProduct } = useInventory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
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
    
    try {
      addProduct({
        name,
        sku,
        category,
        quantity: parseInt(quantity, 10),
        lowStockThreshold: parseInt(lowStockThreshold, 10),
        purchaseCost: parseFloat(purchaseCost),
        sellingPrice: parseFloat(sellingPrice),
        description,
        supplier,
        image,
        variants: [],
        taxRate: 0,
        taxInclusive: false,
      });
      
      toast({
        title: "Product added",
        description: `${name} has been added to your inventory`,
      });
      
      navigate('/inventory');
    } catch (error) {
      toast({
        title: "Error adding product",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div 
        className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center"
        onClick={() => fileInputRef.current?.click()}
      >
        {image ? (
          <div className="relative">
            <img 
              src={image} 
              alt="Product preview" 
              className="h-64 max-w-full mx-auto object-contain rounded"
            />
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <Camera className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Click to add product image</p>
            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, GIF</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
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
