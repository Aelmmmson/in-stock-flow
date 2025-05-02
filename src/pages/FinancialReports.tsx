
import { useState, useEffect } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FinancialPeriod } from '@/types';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, FileText, TrendingUp } from 'lucide-react';

const FinancialReports = () => {
  const { expenses, transactions, getFinancialSummary, currencySymbol } = useInventory();
  const [selectedPeriod, setSelectedPeriod] = useState<FinancialPeriod>({
    startDate: new Date(new Date().setDate(1)).toISOString(),
    endDate: new Date().toISOString(),
    label: 'This Month',
  });
  const [summary, setSummary] = useState<{
    totalSales: number;
    totalExpenses: number;
    profit: number;
    topSellingProducts: { name: string; quantity: number; revenue: number }[];
  }>({
    totalSales: 0,
    totalExpenses: 0,
    profit: 0,
    topSellingProducts: [],
  });

  const periods: FinancialPeriod[] = [
    {
      label: 'This Month',
      startDate: new Date(new Date().setDate(1)).toISOString(),
      endDate: new Date().toISOString(),
    },
    {
      label: 'Last Month',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString(),
    },
    {
      label: 'This Quarter',
      startDate: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1).toISOString(),
      endDate: new Date().toISOString(),
    },
    {
      label: 'This Year',
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      endDate: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const startDate = new Date(selectedPeriod.startDate);
    const endDate = new Date(selectedPeriod.endDate);
    const data = getFinancialSummary(startDate, endDate);
    setSummary(data);
  }, [selectedPeriod, getFinancialSummary]);

  const chartData = summary.topSellingProducts.map((product) => ({
    name: product.name,
    revenue: product.revenue,
  }));

  const expenseByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
    const date = new Date(expense.date);
    const start = new Date(selectedPeriod.startDate);
    const end = new Date(selectedPeriod.endDate);

    if (date >= start && date <= end) {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
    }
    return acc;
  }, {});

  const expenseCategoriesData = Object.entries(expenseByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <Button
              key={period.label}
              variant={selectedPeriod.label === period.label ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{summary.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For {selectedPeriod.label.toLowerCase()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{summary.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For {selectedPeriod.label.toLowerCase()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Profit
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currencySymbol}{summary.profit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.profit >= 0 ? 'Profit' : 'Loss'} for {selectedPeriod.label.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.topSellingProducts.length > 0 ? (
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    sales: { label: 'Revenue' },
                  }}
                >
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <ChartTooltip />
                  </BarChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                No sales data available for this period
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseCategoriesData.length > 0 ? (
              <div className="space-y-4">
                {expenseCategoriesData.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.category}</span>
                      <span className="font-medium">
                        {currencySymbol}{item.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.amount / summary.totalExpenses) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                No expense data available for this period
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Button size="sm" variant="outline" disabled>
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions
                .filter((t) => {
                  const date = new Date(t.createdAt);
                  const start = new Date(selectedPeriod.startDate);
                  const end = new Date(selectedPeriod.endDate);
                  return date >= start && date <= end;
                })
                .slice(0, 5)
                .map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">{transaction.type}</TableCell>
                    <TableCell>{transaction.notes || 'No description'}</TableCell>
                    <TableCell className="text-right">
                      {transaction.type === 'sale' && '+'}
                      {transaction.type === 'purchase' && '-'}
                      {currencySymbol}
                      {transaction.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Assets</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span>Inventory Value (at cost)</span>
                  <span className="font-medium">
                    {currencySymbol}
                    {transactions
                      .filter((t) => t.type === 'purchase')
                      .reduce((sum, t) => sum + t.totalAmount, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Inventory Value (at retail)</span>
                  <span className="font-medium">
                    {currencySymbol}
                    {transactions
                      .filter((t) => t.type === 'sale')
                      .reduce((sum, t) => sum + t.totalAmount, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1 font-medium">
                  <span>Total Assets</span>
                  <span>
                    {currencySymbol}
                    {(
                      transactions
                        .filter((t) => t.type === 'purchase')
                        .reduce((sum, t) => sum + t.totalAmount, 0) +
                      transactions
                        .filter((t) => t.type === 'sale')
                        .reduce((sum, t) => sum + t.totalAmount, 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Liabilities</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span>Recurring Expenses</span>
                  <span className="font-medium">
                    {currencySymbol}
                    {expenses
                      .filter((e) => e.recurring)
                      .reduce((sum, e) => sum + e.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1 font-medium">
                  <span>Total Liabilities</span>
                  <span>
                    {currencySymbol}
                    {expenses
                      .filter((e) => e.recurring)
                      .reduce((sum, e) => sum + e.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Net Worth</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1 font-medium text-lg">
                  <span>Total</span>
                  <span className={summary.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {currencySymbol}
                    {summary.profit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
