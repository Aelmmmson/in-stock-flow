
import { TabsType } from '@/types';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import NotificationsDropdown from '../notifications/NotificationsDropdown';
import { ScrollArea } from '../ui/scroll-area';

interface MobileHeaderProps {
  activeTab: TabsType;
  toggleNotificationsPanel: () => void;
}

const MobileHeader = ({ activeTab, toggleNotificationsPanel }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const isNestedPage = location.pathname !== '/' && 
                       location.pathname !== '/inventory' && 
                       location.pathname !== '/transactions' && 
                       location.pathname !== '/reports' && 
                       location.pathname !== '/settings';

  const getPageTitle = () => {
    // Get the last part of the pathname
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length === 0) return 'Dashboard';
    
    const lastPath = path[0];
    // Capitalize the first letter
    return lastPath.charAt(0).toUpperCase() + lastPath.slice(1);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
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
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 relative">
            <img 
              src="/lovable-uploads/2a3413ad-6596-43b9-9a24-eaa892ea1627.png" 
              alt="Didiz Closet Logo" 
              className="h-full w-full object-contain rounded-full"
            />
          </div>
          
          <div className="relative">
            <Button 
              size="icon" 
              variant="ghost" 
              className="relative"
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
            </Button>
            
            {notificationsOpen && (
              <NotificationsDropdown onClose={() => setNotificationsOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
