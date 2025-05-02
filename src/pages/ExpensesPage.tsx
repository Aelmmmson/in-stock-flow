
import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { toast } from "sonner";

const ExpensesPage = () => {
  const { expenses, addExpense, deleteExpense, updateExpense, currencySymbol } = useInventory();
  const [openDialog, setOpenDialog] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState("all");
  const [currentPeriod, setCurrentPeriod] = useState("currentMonth");

  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  // Filter expenses based on period
  const getFilteredExpenses = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    
    let startDate;
    
    switch (currentPeriod) {
      case "currentMonth":
        startDate = firstDayOfMonth;
        break;
      case "currentYear":
        startDate = firstDayOfYear;
        break;
      case "allTime":
        return expenses;
      default:
        startDate = firstDayOfMonth;
    }
    
    return expenses.filter(expense => new Date(expense.date) >= startDate);
  };
  
  const filteredExpenses = getFilteredExpenses().filter(expense => {
    if (expenseFilter === "all") return true;
    if (expenseFilter === "recurring" && expense.recurring) return true;
    if (expenseFilter === "one-time" && !expense.recurring) return true;
    return false;
  });

  // Calculate total expenses for the current filter
  const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExpense.category || newExpense.amount <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    addExpense(newExpense);
    setNewExpense({
      category: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false,
      frequency: 'monthly',
    });
    setOpenDialog(false);
    toast.success("Expense added successfully");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const expenseCategories = [
    "Rent",
    "Utilities",
    "Salaries",
    "Inventory",
    "Marketing",
    "Transportation",
    "Equipment",
    "Office Supplies",
    "Insurance",
    "Taxes",
    "Maintenance",
    "Other"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Record a new expense for your business
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₵) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add details about this expense"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={newExpense.recurring}
                    onCheckedChange={(checked) => setNewExpense(prev => ({ ...prev, recurring: checked }))}
                  />
                  <Label htmlFor="recurring">Recurring Expense</Label>
                </div>
                {newExpense.recurring && (
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={newExpense.frequency}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => 
                        setNewExpense(prev => ({ ...prev, frequency: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Expense</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Expense List</CardTitle>
                <div className="flex gap-2">
                  <Select 
                    value={currentPeriod}
                    onValueChange={setCurrentPeriod}
                  >
                    <SelectTrigger className="w-[150px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="currentMonth">This Month</SelectItem>
                      <SelectItem value="currentYear">This Year</SelectItem>
                      <SelectItem value="allTime">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={expenseFilter}
                    onValueChange={setExpenseFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Expenses</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Recurring</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{formatDate(expense.date)}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{expense.description}</TableCell>
                          <TableCell>
                            {expense.recurring ? 
                              `Yes (${expense.frequency})` : 'No'}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {currencySymbol}{expense.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No expenses found for the selected period.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>
                Expense summary for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">{currencySymbol}{totalExpenses.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Expenses by Category</p>
                <div className="space-y-2">
                  {Object.entries(expensesByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">{category}</span>
                          <span className="text-sm font-medium">
                            {currencySymbol}{amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full" 
                            style={{ width: `${(amount / totalExpenses) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recurring Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredExpenses.filter(e => e.recurring).length > 0 ? (
                <div className="space-y-2">
                  {filteredExpenses
                    .filter(e => e.recurring)
                    .map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{expense.category}</p>
                          <p className="text-xs text-muted-foreground">
                            {expense.frequency.charAt(0).toUpperCase() + expense.frequency.slice(1)}
                          </p>
                        </div>
                        <p className="font-medium">
                          {currencySymbol}{expense.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recurring expenses found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
