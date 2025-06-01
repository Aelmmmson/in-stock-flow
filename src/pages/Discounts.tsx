import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2, Search, Percent, DollarSign, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Discount, ProductCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useInventory } from '@/contexts/InventoryContext';

const Discounts = () => {
  const { toast } = useToast();
  const { products } = useInventory();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [applyToAll, setApplyToAll] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(true);
  
  useEffect(() => {
    // Load discounts from localStorage
    const storedDiscounts = localStorage.getItem('didiz-closet-discounts');
    if (storedDiscounts) {
      setDiscounts(JSON.parse(storedDiscounts));
    }
    
    // Load categories
    const storedCategories = localStorage.getItem('didiz-closet-categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);
  
  const saveDiscounts = (updatedDiscounts: Discount[]) => {
    setDiscounts(updatedDiscounts);
    localStorage.setItem('didiz-closet-discounts', JSON.stringify(updatedDiscounts));
  };
  
  const handleAddDiscount = () => {
    if (!name.trim() || !value.trim()) {
      toast({
        title: "Error",
        description: "Discount name and value are required",
        variant: "destructive"
      });
      return;
    }
    
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      toast({
        title: "Error",
        description: "Invalid discount value",
        variant: "destructive"
      });
      return;
    }
    
    if (type === 'percentage' && parsedValue > 100) {
      toast({
        title: "Error",
        description: "Percentage discount cannot exceed 100%",
        variant: "destructive"
      });
      return;
    }
    
    const discountData: Discount = {
      id: editingDiscount?.id || Date.now().toString(),
      name,
      type,
      value: parsedValue,
      applyToAll,
      appliedCategories: applyToAll ? undefined : selectedCategories.length > 0 ? selectedCategories : undefined,
      appliedProducts: applyToAll ? undefined : selectedProducts.length > 0 ? selectedProducts : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      active,
      timesUsed: editingDiscount?.timesUsed || 0,
      createdAt: editingDiscount?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (editingDiscount) {
      // Update existing discount
      const updatedDiscounts = discounts.map(disc => 
        disc.id === editingDiscount.id ? discountData : disc
      );
      saveDiscounts(updatedDiscounts);
      toast({
        title: "Success",
        description: "Discount updated successfully"
      });
    } else {
      // Add new discount
      saveDiscounts([...discounts, discountData]);
      toast({
        title: "Success",
        description: "Discount added successfully"
      });
    }
    
    // Reset form
    handleCloseDialog();
  };
  
  const handleDeleteDiscount = (id: string) => {
    const updatedDiscounts = discounts.filter(disc => disc.id !== id);
    saveDiscounts(updatedDiscounts);
    toast({
      title: "Success",
      description: "Discount deleted successfully"
    });
  };
  
  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setName(discount.name);
    setType(discount.type);
    setValue(discount.value.toString());
    setApplyToAll(discount.applyToAll);
    setSelectedCategories(discount.appliedCategories || []);
    setSelectedProducts(discount.appliedProducts || []);
    setStartDate(discount.startDate || '');
    setEndDate(discount.endDate || '');
    setActive(discount.active);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setEditingDiscount(null);
    setName('');
    setType('percentage');
    setValue('');
    setApplyToAll(true);
    setSelectedCategories([]);
    setSelectedProducts([]);
    setStartDate('');
    setEndDate('');
    setActive(true);
    setDialogOpen(false);
  };
  
  const getDiscountDetails = (discount: Discount) => {
    const details = [];
    
    if (discount.startDate || discount.endDate) {
      let dateText = 'Valid';
      if (discount.startDate) {
        dateText += ` from ${format(new Date(discount.startDate), 'PP')}`;
      }
      if (discount.endDate) {
        dateText += ` to ${format(new Date(discount.endDate), 'PP')}`;
      }
      details.push(dateText);
    }
    
    if (!discount.applyToAll) {
      if (discount.appliedCategories?.length) {
        details.push(`Applied to ${discount.appliedCategories.length} categories`);
      }
      if (discount.appliedProducts?.length) {
        details.push(`Applied to ${discount.appliedProducts.length} products`);
      }
    } else {
      details.push('Applied to all products');
    }
    
    return details;
  };
  
  const filteredDiscounts = discounts.filter(disc => 
    disc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  const toggleCategorySelection = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  return (
    <ScrollArea className="h-full scrollbar-none">
      <div className="space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Discounts</h1>
          <Button 
            className="bg-pink-500 hover:bg-pink-600"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Discount
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search discounts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {filteredDiscounts.length > 0 ? (
            filteredDiscounts.map(discount => (
              <Card key={discount.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{discount.name}</h3>
                      <Badge variant={discount.active ? "default" : "outline"}>
                        {discount.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center mt-1">
                      <Badge variant="secondary" className="mr-2">
                        {discount.type === 'percentage' ? (
                          <><Percent className="h-3 w-3 mr-1" /> {discount.value}%</>
                        ) : (
                          <><DollarSign className="h-3 w-3 mr-1" /> {discount.value}</>
                        )}
                      </Badge>
                      
                      <p className="text-xs text-muted-foreground">
                        {getDiscountDetails(discount).join(' • ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditDiscount(discount)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDeleteDiscount(discount.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No discounts found</p>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDiscount ? 'Edit Discount' : 'Add Discount'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discount-name">Discount Name *</Label>
              <Input
                id="discount-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter discount name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount-type">Discount Type</Label>
                <Select 
                  value={type} 
                  onValueChange={(val: 'percentage' | 'fixed') => setType(val)}
                >
                  <SelectTrigger id="discount-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="discount-value">
                  Discount Value {type === 'percentage' ? '(%)' : ''}*
                </Label>
                <Input
                  id="discount-value"
                  type="number"
                  min="0"
                  step={type === 'percentage' ? '1' : '0.01'}
                  max={type === 'percentage' ? '100' : undefined}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={type === 'percentage' ? "e.g., 20" : "e.g., 10.99"}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Label htmlFor="start-date">Start Date (Optional)</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="apply-all" 
                checked={applyToAll}
                onCheckedChange={setApplyToAll}
              />
              <Label htmlFor="apply-all">Apply to all products</Label>
            </div>
            
            {!applyToAll && (
              <div className="space-y-4">
                <div>
                  <Label>Select Categories</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cat-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategorySelection(category.id)}
                        />
                        <Label 
                          htmlFor={`cat-${category.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Select Products</Label>
                  <div className="h-40 overflow-y-auto border rounded-md p-2 mt-2">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2 py-1">
                        <Checkbox 
                          id={`prod-${product.id}`}
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleProductSelection(product.id)}
                        />
                        <Label 
                          htmlFor={`prod-${product.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {product.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active-status" 
                checked={active}
                onCheckedChange={setActive}
              />
              <Label htmlFor="active-status">Active</Label>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                className="bg-pink-500 hover:bg-pink-600"
                onClick={handleAddDiscount}
              >
                {editingDiscount ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
};

export default Discounts;
