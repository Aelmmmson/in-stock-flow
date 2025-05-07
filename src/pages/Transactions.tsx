import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
const Transactions = () => {
  const {
    transactions,
    products,
    currencySymbol
  } = useInventory();

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };
  const getProductName = (id: string) => {
    const product = products.find(p => p.id === id);
    return product?.name || 'Unknown Product';
  };
  return <ScrollArea className="h-full scrollbar-none">
      <div className="space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Sales</h1>
          <Button asChild className="bg-pink-500 hover:bg-pink-600">
            <Link to="/transactions/add">
              <Plus className="mr-1 h-4 w-4" /> New
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {sortedTransactions.map((transaction, index) => <Link key={transaction.id} to={`/transactions/${transaction.id}`} className="block">
              <div className="p-4 rounded-lg shadow-sm border border-gray-700 bg-white">
                <div className="flex justify-between mb-1">
                  <div className="font-medium text-gray-500">#{`TR${(index + 1001).toString().padStart(3, '0')}`}</div>
                  <div className="font-medium text-gray-500">{currencySymbol}{transaction.totalAmount.toFixed(2)}</div>
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {formatDate(transaction.createdAt)}
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-gray-400">Items</div>
                  <div className="text-gray-200">{transaction.quantity} × {getProductName(transaction.productId)}</div>
                  
                  <div className="text-gray-400">Customer</div>
                  <div className="text-gray-200">{transaction.customer || 'Walk-in Customer'}</div>
                  
                  <div className="text-gray-400">Price Adjustment</div>
                  <div className={transaction.priceDelta < 0 ? 'text-red-500' : 'text-gray-200'}>
                    {transaction.priceDelta !== 0 ? `${transaction.priceDelta > 0 ? '+' : ''}${currencySymbol}${transaction.priceDelta.toFixed(2)}` : 'None'}
                  </div>
                  
                  <div className="text-gray-400">Payment</div>
                  <div className="text-gray-200">{transaction.paymentMethod || 'Cash'}</div>
                </div>
              </div>
            </Link>)}
          
          {transactions.length === 0 && <div className="text-center py-10">
              <p className="text-muted-foreground">No transactions yet.</p>
              <Button asChild className="mt-4 bg-pink-500 hover:bg-pink-600">
                <Link to="/transactions/add">Create your first sale</Link>
              </Button>
            </div>}
        </div>
      </div>
    </ScrollArea>;
};
export default Transactions;