
import { TabsType } from '@/types';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileHeaderProps {
  activeTab: TabsType;
  toggleNotificationsPanel: () => void;
}

const MobileHeader = ({ activeTab, toggleNotificationsPanel }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isNestedPage = location.pathname !== '/' && 
                       location.pathname !== '/inventory' && 
                       location.pathname !== '/transactions' && 
                       location.pathname !== '/reports' && 
                       location.pathname !== '/settings';

  const getTitle = () => {
    // For specific nested pages, return custom titles
    if (location.pathname.includes('/transactions/add')) {
      return 'New Transaction';
    } else if (location.pathname.includes('/inventory/add')) {
      return 'Add New Item';
    } else if (location.pathname.includes('/inventory/edit')) {
      return 'Edit Item';
    } else if (location.pathname.includes('/reports/inventory')) {
      return 'Inventory Report';
    } else if (location.pathname.includes('/reports/sales')) {
      return 'Sales Report';
    } else if (location.pathname.includes('/profile')) {
      return 'Profile';
    }
    
    // For main tabs
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'inventory':
        return 'Inventory';
      case 'transactions':
        return 'Sales';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      default:
        return 'Home';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          {isNestedPage ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : null}
          
          <h1 className="text-xl font-semibold text-foreground">
            Didiz Closet
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {getTitle()}
            </span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 relative">
            <img 
              src="/lovable-uploads/453620d9-01b8-4040-aec4-9f948e52aae1.png" 
              alt="Didiz Closet Logo" 
              className="h-full w-full object-contain rounded-full"
            />
          </div>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="relative"
            onClick={toggleNotificationsPanel}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
