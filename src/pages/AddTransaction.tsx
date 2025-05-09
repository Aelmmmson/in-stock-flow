
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, User, Wallet, Trash2, Edit, ShoppingCart, Minus, X, ScanLine } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductVariant } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { BarcodeScannerDialog } from '@/components/inventory/BarcodeScanner';
import { Badge } from '@/components/ui/badge';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  priceDelta: number;
  selectedVariants?: Record<string, string>;
}

const AddTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { products, addTransaction, currencySymbol, getActiveDiscounts, getDiscountedPrice } = useInventory();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  
  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addToCartDialogOpen, setAddToCartDialogOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  
  // Selected product for add to cart
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [addQuantity, setAddQuantity] = useState('1');
  const [addPrice, setAddPrice] = useState('0');
  const [addDiscount, setAddDiscount] = useState('0');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  // Editing item
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editQuantity, setEditQuantity] = useState('1');
  const [editPrice, setEditPrice] = useState('0');
  const [editDiscount, setEditDiscount] = useState('0');
  
  useEffect(() => {
    // Check if there's a product to add from the location state
    if (location.state?.productToAdd) {
      const productId = location.state.productToAdd;
      const product = products.find(p => p.id === productId);
      
      if (product) {
        setSelectedProduct(product);
        setAddQuantity('1');
        // Apply active discounts to the product price
        const discountedPrice = getDiscountedPrice(product);
        setAddPrice(discountedPrice.toString());
        setAddDiscount('0');
        setSelectedVariants({});
        setAddToCartDialogOpen(true);
      }
      
      // Clear the state to prevent re-adding on navigation
      navigate(location.pathname, { replace: true });
    }
  }, [location, products, navigate, getDiscountedPrice]);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.price - parseFloat(item.priceDelta.toString())),
    0
  );

  const selectProductForCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    setSelectedProduct(product);
    setAddQuantity('1');
    // Apply active discounts to the product price
    const discountedPrice = getDiscountedPrice(product);
    setAddPrice(discountedPrice.toString());
    setAddDiscount('0');
    setSelectedVariants({});
    setAddToCartDialogOpen(true);
    setProductDialogOpen(false);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    const existingItemIndex = cartItems.findIndex(item => {
      const sameProduct = item.productId === selectedProduct.id;
      
      // Check if variants match
      const variantsMatch = Object.keys(selectedVariants).length > 0 ? 
        Object.keys(selectedVariants).every(key => 
          item.selectedVariants?.[key] === selectedVariants[key]
        ) : 
        true;
        
      return sameProduct && variantsMatch;
    });
    
    const discountAmount = parseFloat(addDiscount) || 0;
    const finalPrice = Math.max(0, parseFloat(addPrice) - discountAmount);
    
    if (existingItemIndex >= 0) {
      // If item already exists in cart, increase quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += parseInt(addQuantity, 10);
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          productId: selectedProduct.id,
          quantity: parseInt(addQuantity, 10),
          price: parseFloat(addPrice),
          priceDelta: parseFloat(addDiscount),
          selectedVariants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined
        }
      ]);
    }
    
    toast({
      title: "Item added",
      description: `${selectedProduct.name} added to cart`
    });
    
    setAddToCartDialogOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };

  const handleEditItem = (item: CartItem, index: number) => {
    setEditingItem(item);
    setEditQuantity(item.quantity.toString());
    setEditPrice(item.price.toString());
    setEditDiscount(item.priceDelta.toString());
    setEditDialogOpen(true);
  };

  const saveItemEdit = () => {
    if (!editingItem) return;
    
    const updatedItems = cartItems.map(item => 
      item.productId === editingItem.productId &&
      JSON.stringify(item.selectedVariants) === JSON.stringify(editingItem.selectedVariants)
        ? {
            ...item,
            quantity: parseInt(editQuantity || '1', 10),
            price: parseFloat(editPrice || '0'),
            priceDelta: parseFloat(editDiscount || '0')
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
  
  const incrementQuantity = () => {
    setAddQuantity((prev) => (parseInt(prev) + 1).toString());
  };
  
  const decrementQuantity = () => {
    setAddQuantity((prev) => (Math.max(1, parseInt(prev) - 1)).toString());
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
          originalPrice: item.price,
          actualPrice: item.price - item.priceDelta,
          priceDelta: -item.priceDelta, // Negative because discounts are stored as positive values in the cart
          totalAmount: item.quantity * (item.price - item.priceDelta),
          notes,
          customer,
          paymentMethod,
        } as any);
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
  
  const getVariantsDisplay = (variants?: Record<string, string>) => {
    if (!variants || Object.keys(variants).length === 0) return null;
    
    return (
      <div className="text-xs text-gray-400 mt-1">
        {Object.entries(variants).map(([name, value]) => (
          <span key={name} className="mr-2">
            {name}: {value}
          </span>
        ))}
      </div>
    );
  };

  const handleVariantSelect = (name: string, value: string) => {
    setSelectedVariants({
      ...selectedVariants,
      [name]: value
    });
  };
  
  const handleBarcodeScan = (result: string) => {
    // Extract SKU from the scanned result
    const skuMatch = result.match(/SKU:([^,]+)/);
    if (skuMatch) {
      const sku = skuMatch[1];
      const product = products.find(p => p.sku === sku);
      
      if (product) {
        setSelectedProduct(product);
        setAddQuantity('1');
        setAddPrice(product.sellingPrice.toString());
        setAddDiscount('0');
        setSelectedVariants({});
        setAddToCartDialogOpen(true);
      } else {
        toast({
          title: "Product not found",
          description: `No product found with SKU: ${sku}`,
          variant: "destructive",
        });
      }
    }
    
    setScannerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Items</h2>
        
        {cartItems.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded-lg border border-dashed border-gray-700 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
              <ShoppingCart className="h-6 w-6 text-gray-400" />
            </div>
            <div className="mt-2 text-gray-300">No items added yet</div>
            <div className="mt-4 flex gap-2 justify-center">
              <Button 
                className="bg-pink-500 hover:bg-pink-600"
                onClick={() => setProductDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
              <Button 
                variant="outline"
                onClick={() => setScannerOpen(true)}
              >
                <ScanLine className="h-4 w-4 mr-1" /> Scan
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => {
              const product = products.find(p => p.id === item.productId);
              const itemTotal = item.quantity * (item.price - item.priceDelta);
              
              return (
                <div key={`${item.productId}-${index}`} className="bg-gray-800 p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-white">{getProductName(item.productId)}</div>
                    <div className="text-sm text-gray-300">
                      Qty: {item.quantity} × {currencySymbol}{(item.price - item.priceDelta).toFixed(2)}
                      {item.priceDelta > 0 && (
                        <span className="ml-2 text-green-400">
                          (Discount: {currencySymbol}{item.priceDelta.toFixed(2)})
                        </span>
                      )}
                    </div>
                    {getVariantsDisplay(item.selectedVariants)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="font-medium text-white">{currencySymbol}{itemTotal.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditItem(item, index)}
                    >
                      <Edit className="h-4 w-4 text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 justify-center border-dashed bg-transparent text-pink-500 border-gray-700"
                variant="outline" 
                onClick={() => setProductDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setScannerOpen(true)}
                className="border-dashed border-gray-700"
              >
                <ScanLine className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Transaction Details</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-400">
              <User className="h-4 w-4 mr-2" />
              <span>Customer</span>
            </div>
            <Input
              placeholder="Walk-in Customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-400">
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
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                  onClick={() => handlePaymentMethodChange(method)}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Notes</div>
            <Textarea 
              placeholder="Add transaction notes (optional)" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-4">
        <div className="font-medium text-white">Total</div>
        <div className="text-xl font-bold text-white">{currencySymbol}{totalAmount.toFixed(2)}</div>
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
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Select Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            
            <ScrollArea className="max-h-[350px] scrollbar-none">
              <div className="space-y-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-md cursor-pointer"
                      onClick={() => selectProductForCart(product.id)}
                    >
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-gray-400">
                          SKU: {product.sku} | Stock: {product.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-white">
                        {currencySymbol}{product.sellingPrice.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3 text-gray-400">
                    No products found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add to Cart Dialog */}
      <Dialog open={addToCartDialogOpen} onOpenChange={setAddToCartDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add to Cart</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <p className="text-xl font-medium text-white">{selectedProduct.name}</p>
                <p className="text-sm text-gray-400">SKU: {selectedProduct.sku}</p>
              </div>
              
              {/* Variants selection */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-white">Select Options</Label>
                  {selectedProduct.variants.map((variant: ProductVariant) => (
                    <div key={variant.id} className="space-y-1">
                      <Label className="text-sm text-gray-400">{variant.name}</Label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className={`px-3 py-1 text-sm rounded-md ${
                            selectedVariants[variant.name] === variant.value
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-800 border border-gray-700 text-gray-300'
                          }`}
                          onClick={() => handleVariantSelect(variant.name, variant.value)}
                        >
                          {variant.value}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div>
                <Label className="text-white">Quantity</Label>
                <div className="flex items-center mt-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={decrementQuantity}
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={addQuantity}
                    onChange={(e) => setAddQuantity(e.target.value)}
                    className="mx-2 text-center bg-gray-800 border-gray-700 text-white"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={incrementQuantity}
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-white">Price ({currencySymbol})</Label>
                <Input
                  readOnly
                  type="number"
                  min="0"
                  step="0.01"
                  value={addPrice}
                  className="bg-gray-800 border-gray-700 text-white opacity-75"
                />
              </div>
              
              <div>
                <Label className="text-white">Discount ({currencySymbol})</Label>
                <Input
                  type="number"
                  min="0"
                  max={addPrice}
                  step="0.01"
                  value={addDiscount}
                  onChange={(e) => setAddDiscount(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter amount to discount
                </p>
              </div>
              
              <div className="text-white">
                <div className="font-semibold">Total</div>
                <div className="text-xl font-bold">
                  {currencySymbol}{(
                    parseFloat(addQuantity) * (parseFloat(addPrice) - parseFloat(addDiscount || '0'))
                  ).toFixed(2)}
                </div>
              </div>
              
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-1 text-white">
                  Product
                </Label>
                <div className="font-medium text-white">{getProductName(editingItem.productId)}</div>
                {editingItem.selectedVariants && Object.keys(editingItem.selectedVariants).length > 0 && (
                  <div className="text-sm text-gray-400 mt-1">
                    {Object.entries(editingItem.selectedVariants).map(([name, value]) => (
                      <span key={name} className="mr-2">
                        {name}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-1 text-white">
                  Quantity
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-1 text-white">
                  Base Price ({currencySymbol})
                </Label>
                <Input
                  readOnly
                  type="number"
                  min="0"
                  step="0.01"
                  value={editPrice}
                  className="bg-gray-800 border-gray-700 text-white opacity-75"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-1 text-white">
                  Discount ({currencySymbol})
                </Label>
                <Input
                  type="number"
                  min="0"
                  max={editPrice}
                  step="0.01"
                  value={editDiscount}
                  onChange={(e) => setEditDiscount(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter amount to discount
                </p>
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-1 text-white">
                  Item Total
                </Label>
                <div className="font-bold text-lg text-white">
                  {currencySymbol}
                  {(
                    parseInt(editQuantity || '0', 10) * 
                    (parseFloat(editPrice || '0') - parseFloat(editDiscount || '0'))
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
      
      {/* Barcode Scanner */}
      <BarcodeScannerDialog 
        open={scannerOpen} 
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleBarcodeScan}
      />
    </div>
  );
};

export default AddTransaction;
