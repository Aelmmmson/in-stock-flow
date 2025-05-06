
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ProductCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Categories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = localStorage.getItem('didiz-closet-categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Default categories
      const defaultCategories: ProductCategory[] = [
        {
          id: '1',
          name: 'Dresses',
          description: 'All types of dresses',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Tops',
          description: 'Shirts, blouses, and other tops',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Bottoms',
          description: 'Pants, skirts, and shorts',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Accessories',
          description: 'Jewelry, bags, and other accessories',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Shoes',
          description: 'All types of footwear',
          createdAt: new Date().toISOString()
        }
      ];
      
      setCategories(defaultCategories);
      localStorage.setItem('didiz-closet-categories', JSON.stringify(defaultCategories));
    }
  }, []);
  
  const saveCategories = (updatedCategories: ProductCategory[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('didiz-closet-categories', JSON.stringify(updatedCategories));
  };
  
  const handleAddCategory = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? { 
          ...cat, 
          name, 
          description,
          createdAt: cat.createdAt 
        } : cat
      );
      saveCategories(updatedCategories);
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
    } else {
      // Add new category
      const newCategory: ProductCategory = {
        id: Date.now().toString(),
        name,
        description: description || undefined,
        createdAt: new Date().toISOString()
      };
      saveCategories([...categories, newCategory]);
      toast({
        title: "Success",
        description: "Category added successfully"
      });
    }
    
    // Reset form
    handleCloseDialog();
  };
  
  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== id);
    saveCategories(updatedCategories);
    toast({
      title: "Success",
      description: "Category deleted successfully"
    });
  };
  
  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setDialogOpen(false);
  };
  
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <ScrollArea className="h-full scrollbar-none">
      <div className="space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Product Categories</h1>
          <Button 
            className="bg-pink-500 hover:bg-pink-600"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <Card key={category.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No categories found</p>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="category-description">Description (Optional)</Label>
              <Textarea
                id="category-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                className="bg-pink-500 hover:bg-pink-600"
                onClick={handleAddCategory}
              >
                {editingCategory ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
};

export default Categories;
