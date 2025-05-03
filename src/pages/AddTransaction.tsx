
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, User, Wallet } from 'lucide-react';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addTransaction, currencySymbol } = useInventory();
  
  const [items, setItems] = useState<{
    productId: string;
    quantity: number;
    price: number;
    priceDelta: number;
  }[]>([]);
  
  const [customer, setCustomer] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * (item.price + item.priceDelta),
    0
  );

  const handleAddItem = () => {
    // Navigate to a screen to select products
    navigate('/inventory'); // This would ideally go to a product selection screen
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to create a transaction",
        variant: "destructive",
      });
      return;
    }
    
    // Process each item in the transaction
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;
      
      addTransaction({
        id: crypto.randomUUID(),
        productId: item.productId,
        type: 'sale',
        quantity: item.quantity,
        unitPrice: item.price,
        priceDelta: item.priceDelta,
        totalAmount: item.quantity * (item.price + item.priceDelta),
        createdAt: new Date().toISOString(),
        notes: notes,
        customer: customer,
        paymentMethod: paymentMethod,
      });
    });
    
    toast({
      title: "Transaction completed",
      description: `Successfully created transaction for ${currencySymbol}${totalAmount.toFixed(2)}`,
    });
    
    navigate('/transactions');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Items</h2>
        
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400"><circle cx="8" cy="21" r="2"></circle><circle cx="20" cy="21" r="2"></circle><path d="M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1"></path></svg>
            </div>
            <div className="mt-2">No items added yet</div>
            <Button 
              className="mt-4 bg-pink-500 hover:bg-pink-600"
              onClick={handleAddItem}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Item list would go here */}
            <Button 
              className="w-full justify-center bg-pink-500 hover:bg-pink-600"
              variant="outline" 
              onClick={handleAddItem}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Transaction Details</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4 mr-2" />
              <span>Customer</span>
            </div>
            <Input
              placeholder="Walk-in Customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Wallet className="h-4 w-4 mr-2" />
              <span>Payment Method</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`payment-method-button ${paymentMethod === 'Cash' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('Cash')}
              >
                Cash
              </button>
              <button
                type="button"
                className={`payment-method-button ${paymentMethod === 'Mobile Money' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('Mobile Money')}
              >
                Mobile Money
              </button>
              <button
                type="button"
                className={`payment-method-button ${paymentMethod === 'Card' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('Card')}
              >
                Card
              </button>
              <button
                type="button"
                className={`payment-method-button ${paymentMethod === 'Bank Transfer' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('Bank Transfer')}
              >
                Bank Transfer
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">Notes</div>
            <Textarea 
              placeholder="Add transaction notes (optional)" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-4">
        <div className="font-medium">Total</div>
        <div className="text-xl font-bold">GH₵{totalAmount.toFixed(2)}</div>
      </div>
      
      <Button
        className="w-full bg-pink-500 hover:bg-pink-600"
        onClick={handleSubmit}
        disabled={items.length === 0}
      >
        Complete Transaction
      </Button>
    </div>
  );
};

export default AddTransaction;
