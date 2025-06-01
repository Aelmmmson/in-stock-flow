import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, X, Plus, Trash2 } from 'lucide-react';
import { ProductVariant, ProductCategory } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { useBranch } from '@/contexts/BranchContext';

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProduct, products } = useInventory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentBranch, getUserBranch } = useBranch();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  
  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = localStorage.getItem('didiz-closet-categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);
  
  // Generate SKU based on product name and category
  const generateSKU = useCallback(() => {
    if (!name || !category) return '';
    
    // Get category prefix (first 3 chars)
    const catPrefix = category.slice(0, 3).toUpperCase();
    
    // Get name parts and take first 3 chars
    const nameParts = name.split(' ');
    const namePrefix = nameParts[0].slice(0, 3).toUpperCase();
    
    // Get sequential number
    const existingProducts = products.filter(p => 
      p.sku.startsWith(`${catPrefix}-${namePrefix}`)
    );
    const sequentialNum = (existingProducts.length + 1).toString().padStart(3, '0');
    
    return `${catPrefix}-${namePrefix}-${sequentialNum}`;
  }, [name, category, products]);
  
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
  
  const addVariant = () => {
    setVariants([
      ...variants,
      { id: `variant-${Date.now()}`, name: '', value: '' }
    ]);
  };
  
  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };
  
  const updateVariant = (id: string, field: 'name' | 'value', value: string) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !category || !quantity || !purchaseCost || !sellingPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const sku = generateSKU();
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
        variants: variants.filter(v => v.name && v.value),
        taxRate: 0,
        taxInclusive: false,
      });
      
      toast({
        title: "Product added",
        description: `${name} has been added to your inventory with SKU: ${sku}`,
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
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="category">Category *</Label>
              <Button asChild variant="link" size="sm" className="text-xs h-auto p-0">
                <Link to="/inventory/categories">Manage Categories</Link>
              </Button>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Product Variants</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addVariant}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Variant
              </Button>
            </div>
            
            {variants.length > 0 ? (
              <div className="space-y-3">
                {variants.map(variant => (
                  <div key={variant.id} className="flex gap-2 items-center">
                    <Input
                      placeholder="Name (e.g. Size)"
                      value={variant.name}
                      onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g. Large)"
                      value={variant.value}
                      onChange={(e) => updateVariant(variant.id, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(variant.id)}
                      className="text-red-500 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md text-sm text-gray-500">
                No variants added. Add variants like Size, Color, etc.
              </div>
            )}
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
