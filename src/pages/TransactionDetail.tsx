
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { transactions, products, currencySymbol } = useInventory();
  
  const [transaction, setTransaction] = useState(transactions.find(t => t.id === id));
  
  useEffect(() => {
    if (!transaction) {
      toast({
        title: "Transaction not found",
        description: "The transaction you're looking for doesn't exist",
        variant: "destructive",
      });
      navigate('/transactions');
    }
  }, [transaction, navigate, toast]);
  
  // Also check for cart items
  useEffect(() => {
    const cartItems = localStorage.getItem('cart-items');
    if (cartItems && JSON.parse(cartItems).length > 0) {
      // If there are items in cart, show a button to continue transaction
      const shouldContinue = window.confirm('You have items in your cart. Would you like to continue with your transaction?');
      if (shouldContinue) {
        navigate('/transactions/add');
      }
    }
  }, [navigate]);
  
  if (!transaction) return null;

  const product = products.find(p => p.id === transaction.productId);
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                <circle cx="8" cy="21" r="2"></circle>
                <circle cx="20" cy="21" r="2"></circle>
                <path d="M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1"></path>
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Date & Time</div>
              <div className="font-medium">{formatDateTime(transaction.createdAt)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Customer</div>
              <div className="font-medium">{transaction.customer || 'Walk-in Customer'}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Payment Method</div>
              <div className="font-medium">{transaction.paymentMethod || 'Cash'}</div>
            </div>
          </div>
          
          {transaction.notes && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21h-8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                  <path d="M9 9h1" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Notes</div>
                <div className="font-medium">{transaction.notes}</div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3">Items</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="font-medium">{product?.name || 'Unknown Product'}</div>
                <div className="text-sm text-gray-500">Qty: {transaction.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{currencySymbol}{transaction.totalAmount.toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  {transaction.priceDelta !== 0 && (
                    <span className={transaction.priceDelta < 0 ? 'text-red-500' : 'text-green-500'}>
                      {transaction.priceDelta > 0 ? '+' : ''}{currencySymbol}{transaction.priceDelta.toFixed(2)} adjustment
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-4">
          <div className="font-medium">Total</div>
          <div className="text-xl font-bold">{currencySymbol}{transaction.totalAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
