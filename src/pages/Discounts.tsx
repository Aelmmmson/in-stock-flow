
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tag, Plus, Edit, Trash2, Percent, DollarSign } from 'lucide-react';
import { Discount, ProductCategory } from '@/types';

const Discounts = () => {
  const { discounts, addDiscount, updateDiscount, deleteDiscount, products, categories } = useInventory();
  const { hasAdminAccess } = useAuth();
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [discountForm, setDiscountForm] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    applyToAll: false,
    appliedCategories: [] as string[],
    appliedProducts: [] as string[],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true
  });

  if (!hasAdminAccess()) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <Card>
          <CardContent className="p-6">
            <p>You don't have permission to access discount management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discountData = {
      ...discountForm,
      timesUsed: 0,
      updatedAt: new Date().toISOString()
    };
    
    if (selectedDiscount) {
      updateDiscount({ ...selectedDiscount, ...discountData });
    } else {
      addDiscount(discountData);
    }
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDiscountForm({
      name: '',
      type: 'percentage',
      value: 0,
      applyToAll: false,
      appliedCategories: [],
      appliedProducts: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true
    });
    setSelectedDiscount(null);
  };

  const editDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setDiscountForm({
      name: discount.name,
      type: discount.type,
      value: discount.value,
      applyToAll: discount.applyToAll,
      appliedCategories: discount.appliedCategories || [],
      appliedProducts: discount.appliedProducts || [],
      startDate: discount.startDate,
      endDate: discount.endDate,
      active: discount.active
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Discount Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedDiscount ? 'Edit Discount' : 'Create New Discount'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Discount Name</Label>
                <Input
                  id="name"
                  value={discountForm.name}
                  onChange={(e) => setDiscountForm({ ...discountForm, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">Discount Type</Label>
                <Select value={discountForm.type} onValueChange={(value: 'percentage' | 'fixed') => setDiscountForm({ ...discountForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">
                  {discountForm.type === 'percentage' ? 'Percentage (%)' : 'Amount'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  max={discountForm.type === 'percentage' ? '100' : undefined}
                  value={discountForm.value}
                  onChange={(e) => setDiscountForm({ ...discountForm, value: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="applyToAll"
                  checked={discountForm.applyToAll}
                  onCheckedChange={(checked) => setDiscountForm({ ...discountForm, applyToAll: checked })}
                />
                <Label htmlFor="applyToAll">Apply to all products</Label>
              </div>

              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={discountForm.startDate}
                  onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={discountForm.endDate}
                  onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={discountForm.active}
                  onCheckedChange={(checked) => setDiscountForm({ ...discountForm, active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <Button type="submit" className="w-full">
                {selectedDiscount ? 'Update Discount' : 'Create Discount'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((discount) => (
          <Card key={discount.id} className="border">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold flex items-center">
                  {discount.type === 'percentage' ? (
                    <Percent className="h-4 w-4 mr-1" />
                  ) : (
                    <DollarSign className="h-4 w-4 mr-1" />
                  )}
                  {discount.name}
                </h3>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => editDiscount(discount)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteDiscount(discount.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Value:</span>
                  <span className="font-medium">
                    {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Period:</span>
                  <span className="text-sm">
                    {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Times Used:</span>
                  <span className="text-sm">{discount.timesUsed}</span>
                </div>
                
                <div className="mt-2">
                  <Badge variant={discount.active ? "default" : "secondary"}>
                    {discount.active ? 'Active' : 'Inactive'}
                  </Badge>
                  {discount.applyToAll && (
                    <Badge variant="outline" className="ml-1">
                      All Products
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {discounts.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No discounts yet</h3>
            <p className="text-gray-600">Create your first discount to start offering deals to customers.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Discounts;
