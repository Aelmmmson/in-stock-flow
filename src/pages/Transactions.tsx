
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
import { Search, Plus, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Transactions = () => {
  const { transactions, products, currencySymbol } = useInventory();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPeriod, setCurrentPeriod] = useState('month');

  // Filter transactions by period
  const getPeriodFilteredTransactions = () => {
    const now = new Date();
    let startDate;

    switch (currentPeriod) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    return transactions.filter(t => new Date(t.createdAt) >= startDate);
  };

  // Filter transactions
  const filteredTransactions = getPeriodFilteredTransactions().filter(
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

  // Calculate summary statistics
  const salesCount = filteredTransactions.filter(t => t.type === 'sale').length;
  const salesTotal = filteredTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  
  const purchasesCount = filteredTransactions.filter(t => t.type === 'purchase').length;
  const purchasesTotal = filteredTransactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  
  const adjustmentsCount = filteredTransactions.filter(t => t.type === 'adjustment').length;

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{salesTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{salesCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{purchasesTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{purchasesCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesTotal > 0 
                ? `${((salesTotal - purchasesTotal) / salesTotal * 100).toFixed(1)}%` 
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              {currencySymbol}{(salesTotal - purchasesTotal).toFixed(2)} net
            </p>
          </CardContent>
        </Card>
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

        <Select
          value={currentPeriod}
          onValueChange={setCurrentPeriod}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
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
