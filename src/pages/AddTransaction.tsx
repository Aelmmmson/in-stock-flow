
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { products, addTransaction, currentUser } = useInventory();
  
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<'sale' | 'purchase' | 'adjustment'>('sale');
  const [notes, setNotes] = useState('');
  const [originalPrice, setOriginalPrice] = useState(0);
  const [actualPrice, setActualPrice] = useState(0);
  
  // Get the selected product
  const selectedProduct = products.find((p) => p.id === productId);
  
  // Update prices when product changes
  const handleProductChange = (value: string) => {
    setProductId(value);
    const product = products.find((p) => p.id === value);
    if (product) {
      setOriginalPrice(product.sellingPrice);
      setActualPrice(product.sellingPrice);
    }
  };
  
  // Calculate total amount
  const totalAmount = actualPrice * quantity;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      alert('Please select a product');
      return;
    }
    
    // Validate quantity based on transaction type
    if (type === 'sale' && selectedProduct && quantity > selectedProduct.quantity) {
      alert(`Only ${selectedProduct.quantity} units available in stock`);
      return;
    }
    
    addTransaction({
      productId,
      quantity,
      type,
      notes,
      originalPrice,
      actualPrice,
      totalAmount,
      createdBy: currentUser.id,
    });
    
    navigate('/transactions');
  };
  
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Transaction</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              Record a new sale, purchase, or inventory adjustment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select 
                  value={productId} 
                  onValueChange={handleProductChange}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.quantity} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select 
                  value={type} 
                  onValueChange={(value: 'sale' | 'purchase' | 'adjustment') => setType(value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="originalPrice">
                  {type === 'sale' ? 'List Price' : 'Standard Cost'}
                </Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                  readOnly={!selectedProduct}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="actualPrice">
                  {type === 'sale' ? 'Actual Sale Price' : 'Actual Purchase Cost'}
                </Label>
                <Input
                  id="actualPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={actualPrice}
                  onChange={(e) => setActualPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={totalAmount}
                  readOnly
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional details about this transaction"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">
              {type === 'sale' ? 'Complete Sale' : 
               type === 'purchase' ? 'Record Purchase' : 'Adjust Inventory'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddTransaction;
