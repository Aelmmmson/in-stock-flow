
import { TabsType } from '@/types';

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
        return 'In-Stock Flow';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-semibold text-foreground">
          {getTitle()}
        </h1>
        <div className="flex items-center space-x-4">
          {/* Additional header elements like search or user profile can go here */}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
