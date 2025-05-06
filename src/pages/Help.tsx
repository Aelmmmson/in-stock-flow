
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, Package, ShoppingCart, PieChart, Settings, Tag } from 'lucide-react';

const Help = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Welcome to Didiz Closet help section. Learn how to use the system effectively.</p>
      </div>
      
      <Tabs defaultValue="getting-started">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="getting-started" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-pink-500" />
                Welcome to Didiz Closet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Didiz Closet is a comprehensive inventory management system designed for clothing retailers. Here's how to get started:</p>
              
              <div className="space-y-2">
                <h3 className="font-medium">1. Dashboard Overview</h3>
                <p>The Dashboard provides a quick snapshot of your business:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>View total items in inventory</li>
                  <li>See potential profit from current inventory</li>
                  <li>Monitor total sales</li>
                  <li>Track low stock alerts</li>
                  <li>Review recent sales</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">2. Navigation</h3>
                <p>Use the sidebar or bottom navigation to access different sections:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Dashboard:</strong> Overview of business metrics</li>
                  <li><strong>Inventory:</strong> Manage products and stock levels</li>
                  <li><strong>Sales:</strong> Record and view transactions</li>
                  <li><strong>Discounts:</strong> Create and apply discounts to products</li>
                  <li><strong>Reports:</strong> Generate detailed business reports</li>
                  <li><strong>Settings:</strong> Configure application preferences</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-pink-500" />
                Managing Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The Inventory section is where you manage all your products:</p>
              
              <div className="space-y-2">
                <h3 className="font-medium">Adding New Products</h3>
                <p>To add a new product:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Click the "+" button in the bottom right</li>
                  <li>Fill in the product details (name, SKU, category, etc.)</li>
                  <li>Set purchase cost and selling price</li>
                  <li>Define quantity and low stock threshold</li>
                  <li>Upload product image (optional)</li>
                  <li>Click "Save" to add the product</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Managing Existing Products</h3>
                <p>For existing products, you can:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Edit product details</li>
                  <li>Update quantities</li>
                  <li>Apply discounts</li>
                  <li>Generate barcodes for easier scanning</li>
                  <li>Delete products when necessary</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-pink-500" />
                Recording Sales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Creating a New Sale</h3>
                <p>To record a new sale:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Navigate to Sales or click "New Sale" from the Dashboard</li>
                  <li>Select products from your inventory</li>
                  <li>Specify the quantity for each product</li>
                  <li>Apply any discounts if applicable</li>
                  <li>Enter customer information (optional)</li>
                  <li>Finalize the sale</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Managing Transactions</h3>
                <p>The Sales section allows you to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>View all past transactions</li>
                  <li>Filter sales by date range or products</li>
                  <li>Review transaction details</li>
                  <li>Print receipts</li>
                  <li>Track payment methods</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-pink-500" />
                Managing Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Creating Discounts</h3>
                <p>To create new discounts:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Navigate to the Discounts section</li>
                  <li>Click "Add Discount"</li>
                  <li>Specify the discount name and percentage</li>
                  <li>Choose products or categories to apply the discount to</li>
                  <li>Set validity period (optional)</li>
                  <li>Save the discount</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Applying Discounts</h3>
                <p>Discounts can be applied:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Globally to all products</li>
                  <li>To specific product categories</li>
                  <li>To individual products</li>
                  <li>During the checkout process for one-time use</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-pink-500" />
                Generating Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Available Reports</h3>
                <p>The Reports section includes various reports:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Overview:</strong> General business performance</li>
                  <li><strong>Inventory:</strong> Current stock levels and value</li>
                  <li><strong>Sales:</strong> Transaction records and revenue</li>
                  <li><strong>Financial:</strong> Profit/loss analysis</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Using Reports</h3>
                <p>To get the most out of reports:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Select appropriate date ranges for accurate analysis</li>
                  <li>Use filters to focus on specific products or categories</li>
                  <li>Export reports for record-keeping or sharing</li>
                  <li>Review reports regularly to identify trends</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Need Additional Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If you need further assistance, please contact our support team at 
            <a href="mailto:support@didizcloset.com" className="text-pink-500 ml-1">support@didizcloset.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
