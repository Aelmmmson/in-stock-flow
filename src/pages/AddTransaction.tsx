
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, User, Wallet, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  priceDelta: number;
}

const AddTransaction = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addTransaction, currencySymbol } = useInventory();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  
  // Product selection dialog
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product editing dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editQuantity, setEditQuantity] = useState('1');
  const [editPrice, setEditPrice] = useState('0');
  const [editPriceDelta, setEditPriceDelta] = useState('0');
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.price + item.priceDelta),
    0
  );

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // If item already exists in cart, increase quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          productId,
          quantity: 1,
          price: product.sellingPrice,
          priceDelta: 0
        }
      ]);
    }
    
    setProductDialogOpen(false);
    toast({
      title: "Item added",
      description: `${product.name} added to cart`
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };

  const handleEditItem = (item: CartItem) => {
    setEditingItem(item);
    setEditQuantity(item.quantity.toString());
    setEditPrice(item.price.toString());
    setEditPriceDelta(item.priceDelta.toString());
    setEditDialogOpen(true);
  };

  const saveItemEdit = () => {
    if (!editingItem) return;
    
    const updatedItems = cartItems.map(item => 
      item.productId === editingItem.productId
        ? {
            ...item,
            quantity: parseInt(editQuantity || '1', 10),
            price: parseFloat(editPrice || '0'),
            priceDelta: parseFloat(editPriceDelta || '0')
          }
        : item
    );
    
    setCartItems(updatedItems);
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to create a transaction",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Process each item in the transaction
      cartItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        
        addTransaction({
          type: 'sale',
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          priceDelta: item.priceDelta,
          totalAmount: item.quantity * (item.price + item.priceDelta),
          notes,
          customer,
          paymentMethod,
        });
      });
      
      toast({
        title: "Transaction completed",
        description: `Successfully created transaction for ${currencySymbol}${totalAmount.toFixed(2)}`,
      });
      
      navigate('/transactions');
    } catch (error) {
      toast({
        title: "Error creating transaction",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Items</h2>
        
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400">
                <circle cx="8" cy="21" r="2"></circle>
                <circle cx="20" cy="21" r="2"></circle>
                <path d="M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1"></path>
              </svg>
            </div>
            <div className="mt-2">No items added yet</div>
            <Button 
              className="mt-4 bg-pink-500 hover:bg-pink-600"
              onClick={() => setProductDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => {
              const product = products.find(p => p.id === item.productId);
              const itemTotal = item.quantity * (item.price + item.priceDelta);
              
              return (
                <div key={item.productId} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{getProductName(item.productId)}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity} × {currencySymbol}{(item.price + item.priceDelta).toFixed(2)}
                      {item.priceDelta !== 0 && (
                        <span className={`ml-2 ${item.priceDelta < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          ({item.priceDelta > 0 ? '+' : ''}{currencySymbol}{item.priceDelta.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="font-medium">{currencySymbol}{itemTotal.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            <Button 
              className="w-full justify-center border-dashed"
              variant="outline" 
              onClick={() => setProductDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Transaction Details</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4 mr-2" />
              <span>Customer</span>
            </div>
            <Input
              placeholder="Walk-in Customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Wallet className="h-4 w-4 mr-2" />
              <span>Payment Method</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Cash', 'Mobile Money', 'Card', 'Bank Transfer'].map(method => (
                <button
                  key={method}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm ${
                    paymentMethod === method 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => handlePaymentMethodChange(method)}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">Notes</div>
            <Textarea 
              placeholder="Add transaction notes (optional)" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-4">
        <div className="font-medium">Total</div>
        <div className="text-xl font-bold">{currencySymbol}{totalAmount.toFixed(2)}</div>
      </div>
      
      <Button
        className="w-full bg-pink-500 hover:bg-pink-600"
        onClick={handleSubmit}
        disabled={cartItems.length === 0}
      >
        Complete Transaction
      </Button>
      
      {/* Product Selection Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    className="flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        SKU: {product.sku} | Stock: {product.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">
                      {currencySymbol}{product.sellingPrice.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product
                </label>
                <div className="font-medium">{getProductName(editingItem.productId)}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Base Price ({currencySymbol})
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price Adjustment ({currencySymbol})
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={editPriceDelta}
                  onChange={(e) => setEditPriceDelta(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use negative values for discounts
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Item Total
                </label>
                <div className="font-bold text-lg">
                  {currencySymbol}
                  {(
                    parseInt(editQuantity || '0', 10) * 
                    (parseFloat(editPrice || '0') + parseFloat(editPriceDelta || '0'))
                  ).toFixed(2)}
                </div>
              </div>
              
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600"
                onClick={saveItemEdit}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTransaction;
