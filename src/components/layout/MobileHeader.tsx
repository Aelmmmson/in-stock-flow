
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsType } from '@/types';
import { useLocation } from 'react-router-dom';

interface MobileHeaderProps {
  activeTab: TabsType;
  toggleNotificationsPanel: () => void;
}

const MobileHeader = ({ activeTab, toggleNotificationsPanel }: MobileHeaderProps) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/inventory')) return 'Inventory';
    if (path.startsWith('/transactions')) return 'Transactions';
    if (path.startsWith('/expenses')) return 'Expenses';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/add-product')) return 'Add Product';
    if (path.startsWith('/edit-product')) return 'Edit Product';
    if (path.startsWith('/add-transaction')) return 'Add Transaction';
    if (path.startsWith('/branch-management')) return 'Branch Management';
    if (path.startsWith('/help')) return 'Help & Support';
    
    return 'Didiz Closet';
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleNotificationsPanel}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
