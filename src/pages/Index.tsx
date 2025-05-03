
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Didiz Closet</h1>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={() => navigate('/inventory/add')} 
          className="bg-pink-500 hover:bg-pink-600 flex-1"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
        
        <Button 
          onClick={() => navigate('/transactions/add')} 
          className="bg-purple-500 hover:bg-purple-600 flex-1"
        >
          <Plus className="mr-2 h-4 w-4" /> New Sale
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-md bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="rounded-full bg-pink-100 dark:bg-pink-900/30 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="m21 7.5-2.46-2.46a2 2 0 0 0-2.83 0l-.88.88a2 2 0 0 0 0 2.83L21 15"></path><path d="M15.83 8.77 18 10.94"></path><path d="M13.12 3.88 7 10l2 2-3 3-3-2-1 1 2 3 3-2 2 1 8.12-8.12a2 2 0 0 0 0-2.83l-.88-.87a2 2 0 0 0-2.12-.21Z"></path></svg>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
            <div className="text-xl font-bold">6</div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Potential Profit</div>
            <div className="text-xl font-bold">GH₵4220.00</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 className="font-bold">Low Stock Alerts</h3>
          </div>
          <div className="space-y-2">
            <div className="text-sm">Beaded Statement Necklace</div>
            <div className="text-sm">African Print Men's Shirt</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><circle cx="8" cy="21" r="2"></circle><circle cx="20" cy="21" r="2"></circle><path d="M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1"></path></svg>
            </div>
            <h3 className="font-bold">Recent Sales</h3>
          </div>
          <div className="text-sm">
            <div className="text-gray-500 dark:text-gray-400">20/05/2023</div>
            {/* More recent sales would go here */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
