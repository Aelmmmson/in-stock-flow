
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { products, addTransaction, currencySymbol } = useInventory();
  
  const [transaction, setTransaction] = useState({
    productId: '',
    quantity: 1,
    originalPrice: 0,
    actualPrice: 0,
    notes: '',
    type: 'sale' as 'sale' | 'purchase' | 'adjustment',
  });

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    if (selectedProduct) {
      setTransaction(prev => ({
        ...prev,
        originalPrice: selectedProduct.sellingPrice,
        actualPrice: selectedProduct.sellingPrice
      }));
    }
  }, [selectedProduct]);

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setTransaction(prev => ({ 
      ...prev, 
      productId,
      originalPrice: product ? product.sellingPrice : 0,
      actualPrice: product ? product.sellingPrice : 0
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const calculateTotal = () => {
    return (transaction.actualPrice * transaction.quantity).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaction.productId) {
      toast.error("Please select a product");
      return;
    }
    
    if (transaction.quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    
    // For sales, check if there's enough stock
    if (transaction.type === 'sale' && selectedProduct && transaction.quantity > selectedProduct.quantity) {
      toast.error(`Not enough stock. Only ${selectedProduct.quantity} available.`);
      return;
    }
    
    const totalAmount = transaction.quantity * transaction.actualPrice;
    
    addTransaction({
      ...transaction,
      totalAmount
    });
    
    navigate('/transactions');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Transaction</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type *</Label>
              <Select 
                value={transaction.type}
                onValueChange={(value: 'sale' | 'purchase' | 'adjustment') => 
                  setTransaction(prev => ({ ...prev, type: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="adjustment">Inventory Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productId">Product *</Label>
              <Select 
                value={transaction.productId}
                onValueChange={handleProductChange}
                required
              >
                <SelectTrigger>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={transaction.quantity}
                  onChange={handleNumberChange}
                  required
                />
                {selectedProduct && transaction.type === 'sale' && (
                  <p className="text-sm text-muted-foreground">
                    Current stock: {selectedProduct.quantity}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ({currencySymbol})</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={transaction.originalPrice}
                  onChange={handleNumberChange}
                  readOnly={transaction.type === 'sale' || transaction.type === 'purchase'}
                />
                {transaction.type === 'sale' && (
                  <p className="text-sm text-muted-foreground">
                    Regular selling price
                  </p>
                )}
                {transaction.type === 'purchase' && (
                  <p className="text-sm text-muted-foreground">
                    Regular purchase cost
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actualPrice">
                  {transaction.type === 'sale' ? 'Sale Price' : transaction.type === 'purchase' ? 'Purchase Cost' : 'Adjusted Price'} ({currencySymbol}) *
                </Label>
                <Input
                  id="actualPrice"
                  name="actualPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={transaction.actualPrice}
                  onChange={handleNumberChange}
                  required
                />
                {transaction.type === 'sale' && transaction.actualPrice !== transaction.originalPrice && (
                  <p className={`text-sm ${transaction.actualPrice < transaction.originalPrice ? 'text-red-500' : 'text-green-500'}`}>
                    {transaction.actualPrice < transaction.originalPrice ? 'Discount' : 'Markup'}: {currencySymbol}{Math.abs(transaction.actualPrice - transaction.originalPrice).toFixed(2)} per unit
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <div className="flex items-center h-10 px-4 border rounded-md bg-muted">
                  {currencySymbol}{calculateTotal()}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={transaction.notes}
                onChange={handleChange}
                placeholder="Optional notes about this transaction"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/transactions')}
          >
            Cancel
          </Button>
          <Button type="submit">Record Transaction</Button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
