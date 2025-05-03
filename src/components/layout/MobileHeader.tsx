
import { TabsType } from '@/types';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileHeaderProps {
  activeTab: TabsType;
}

const MobileHeader = ({ activeTab }: MobileHeaderProps) => {
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
        return 'Didiz Closet';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        {isNestedPage ? (
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">{getTitle()}</h1>
          </div>
        ) : (
          <h1 className="text-xl font-semibold text-foreground">{getTitle()}</h1>
        )}
        
        {!isNestedPage && (
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
