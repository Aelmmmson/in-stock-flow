
import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Transactions = () => {
  const { transactions, products, currencySymbol } = useInventory();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter transactions
  const filteredTransactions = transactions.filter(
    (transaction) => {
      const product = products.find((p) => p.id === transaction.productId);
      const matchesSearch = product?.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      return matchesSearch && matchesType;
    }
  ).sort((a, b) => {
    // Sort by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getProductName = (id: string) => {
    const product = products.find((p) => p.id === id);
    return product?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button asChild>
          <Link to="/transactions/add">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={setTypeFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sale">Sales</SelectItem>
            <SelectItem value="purchase">Purchases</SelectItem>
            <SelectItem value="adjustment">Adjustments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price Adjustment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.createdAt)}
                  </TableCell>
                  <TableCell>{getProductName(transaction.productId)}</TableCell>
                  <TableCell>
                    <span className={
                      transaction.type === 'sale' ? 'text-blue-600' :
                      transaction.type === 'purchase' ? 'text-green-600' : 'text-orange-600'
                    }>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell className="text-right">
                    {currencySymbol}{transaction.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className={`text-right ${
                    transaction.priceDelta < 0 ? 'text-red-600' :
                    transaction.priceDelta > 0 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {transaction.priceDelta !== 0 ? (
                      `${transaction.priceDelta > 0 ? '+' : ''}${currencySymbol}${transaction.priceDelta.toFixed(2)}`
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
