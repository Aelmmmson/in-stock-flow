
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Image, X } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useInventory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [product, setProduct] = useState({
    name: '',
    sku: '',
    category: '',
    supplier: '',
    quantity: 0,
    purchaseCost: 0,
    sellingPrice: 0,
    description: '',
    variants: [{ id: Date.now().toString(), name: '', value: '' }],
    image: null as string | null,
    lowStockThreshold: 5,
    taxRate: 0,
    taxInclusive: false,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setPreviewImage(imageDataUrl);
        setProduct((prev) => ({ ...prev, image: imageDataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setProduct((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add validation here if needed
    
    addProduct(product);
    navigate('/inventory');
  };

  const handleAddVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { id: Date.now().toString(), name: '', value: '' }],
    }));
  };

  const handleUpdateVariant = (id: string, field: string, value: string) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const handleRemoveVariant = (id: string) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== id),
    }));
  };

  const categories = ['Dresses', 'Tops', 'Bottoms', 'Shoes', 'Bags', 'Jewelry', 'Accessories'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  name="category" 
                  value={product.category}
                  onValueChange={(value) => 
                    setProduct((prev) => ({ ...prev, category: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={product.supplier}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Product Image</Label>
                {!previewImage ? (
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Upload an image of the product</p>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-xs"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Product preview" 
                      className="h-48 w-full object-contain border rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseCost">Purchase Cost (₵) *</Label>
                    <Input
                      id="purchaseCost"
                      name="purchaseCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.purchaseCost}
                      onChange={handleNumberChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling Price (₵) *</Label>
                    <Input
                      id="sellingPrice"
                      name="sellingPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.sellingPrice}
                      onChange={handleNumberChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Initial Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      value={product.quantity}
                      onChange={handleNumberChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      name="lowStockThreshold"
                      type="number"
                      min="0"
                      value={product.lowStockThreshold}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      value={product.taxRate}
                      onChange={handleNumberChange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="taxInclusive"
                      checked={product.taxInclusive}
                      onCheckedChange={(checked) => 
                        setProduct((prev) => ({ ...prev, taxInclusive: checked }))
                      }
                    />
                    <Label htmlFor="taxInclusive">Tax Inclusive</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Variants</CardTitle>
                <Button type="button" variant="outline" onClick={handleAddVariant}>
                  Add Variant
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="flex items-end space-x-2">
                    <div className="flex-1 space-y-2">
                      <Label>Type (e.g. Size, Color)</Label>
                      <Input
                        value={variant.name}
                        onChange={(e) => 
                          handleUpdateVariant(variant.id, 'name', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Value (e.g. Large, Red)</Label>
                      <Input
                        value={variant.value}
                        onChange={(e) => 
                          handleUpdateVariant(variant.id, 'value', e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVariant(variant.id)}
                      disabled={product.variants.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/inventory')}
          >
            Cancel
          </Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
