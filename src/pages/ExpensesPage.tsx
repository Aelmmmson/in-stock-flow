
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Calendar, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Expense } from '@/types';
import { useInventory } from '@/contexts/InventoryContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const ExpensesPage = () => {
  const { toast } = useToast();
  const { expenses, addExpense, updateExpense, deleteExpense, currencySymbol } = useInventory();
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form states
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: '',
    end: ''
  });
  
  useEffect(() => {
    // Initialize with latest expenses
    filterExpenses();
  }, [expenses, searchQuery, categoryFilter, dateRangeFilter]);
  
  const filterExpenses = () => {
    let filtered = [...expenses];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(expense => 
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }
    
    // Apply date range filter
    if (dateRangeFilter.start && dateRangeFilter.end) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        const startDate = new Date(dateRangeFilter.start);
        const endDate = new Date(dateRangeFilter.end);
        
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredExpenses(filtered);
  };
  
  const openCreateDialog = () => {
    setCurrentExpense(null);
    setCategory('');
    setAmount('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setNotes('');
    setPaymentMethod('Cash');
    setDialogOpen(true);
  };
  
  const openEditDialog = (expense: Expense) => {
    setCurrentExpense(expense);
    setCategory(expense.category);
    setAmount(expense.amount.toString());
    setDate(format(new Date(expense.date), 'yyyy-MM-dd'));
    setNotes(expense.notes);
    setPaymentMethod(expense.paymentMethod);
    setDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (!category || !amount || !date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const expenseData: Partial<Expense> = {
        category,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        notes,
        paymentMethod,
      };
      
      if (currentExpense) {
        // Update existing expense
        updateExpense({
          ...expenseData,
          id: currentExpense.id
        } as Expense);
        
        toast({
          title: "Expense updated",
          description: "Expense has been updated successfully"
        });
      } else {
        // Create new expense
        addExpense(expenseData as Omit<Expense, 'id'>);
        
        toast({
          title: "Expense added",
          description: "Expense has been added successfully"
        });
      }
      
      setDialogOpen(false);
      filterExpenses();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteExpense = (expense: Expense) => {
    deleteExpense(expense.id);
    toast({
      title: "Expense deleted",
      description: "Expense has been deleted successfully"
    });
    filterExpenses();
  };
  
  const applyFilter = () => {
    filterExpenses();
    setFilterOpen(false);
  };
  
  const clearFilters = () => {
    setCategoryFilter('');
    setDateRangeFilter({ start: '', end: '' });
    setFilterOpen(false);
  };
  
  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];
  
  return (
    <ScrollArea className="h-full scrollbar-none">
      <div className="space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Expenses</h1>
          <Button
            className="bg-pink-500 hover:bg-pink-600"
            onClick={openCreateDialog}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search expenses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <Card key={expense.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{expense.category}</h3>
                      <span className="ml-2 text-xs text-gray-500">
                        {format(new Date(expense.date), 'PP')}
                      </span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{currencySymbol}{expense.amount.toFixed(2)}</p>
                    {expense.notes && (
                      <p className="text-sm text-gray-500 mt-1">{expense.notes}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Payment: {expense.paymentMethod}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDeleteExpense(expense)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No expenses found</p>
              <Button
                className="mt-4 bg-pink-500 hover:bg-pink-600"
                onClick={openCreateDialog}
              >
                Add your first expense
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Expense Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentExpense ? 'Edit Expense' : 'Add Expense'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Rent, Utilities, Supplies"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">{currencySymbol}</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="payment-method">Payment Method *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Cash', 'Mobile Money', 'Card', 'Bank Transfer'].map(method => (
                  <button
                    key={method}
                    type="button"
                    className={`px-3 py-1 text-sm rounded-md ${
                      paymentMethod === method 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional details (optional)"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-pink-500 hover:bg-pink-600"
                onClick={handleSubmit}
              >
                {currentExpense ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Expenses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label htmlFor="date-start" className="text-xs">From</Label>
                  <Input
                    id="date-start"
                    type="date"
                    value={dateRangeFilter.start}
                    onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, start: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date-end" className="text-xs">To</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={dateRangeFilter.end}
                    onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, end: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
              <Button
                className="bg-pink-500 hover:bg-pink-600"
                onClick={applyFilter}
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
};

export default ExpensesPage;
