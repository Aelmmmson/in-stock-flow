
import { TabsType } from '@/types';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  activeTab: TabsType;
}

const MobileHeader = ({ activeTab }: MobileHeaderProps) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'inventory':
        return 'Inventory';
      case 'transactions':
        return 'Transactions';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      default:
        return 'InventoryPro';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-semibold text-foreground">
          {getTitle()}
        </h1>
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
