
import { TabsType } from '@/types';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ArrowRightLeft, BarChart3, Settings, Receipt } from 'lucide-react';

interface MobileNavbarProps {
  activeTab: TabsType;
  setActiveTab: (tab: TabsType) => void;
}

const MobileNavbar = ({ activeTab, setActiveTab }: MobileNavbarProps) => {
  const location = useLocation();

  const navItems = [
    { id: 'dashboard' as TabsType, label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'inventory' as TabsType, label: 'Inventory', icon: Package, path: '/inventory' },
    { id: 'transactions' as TabsType, label: 'Transactions', icon: ArrowRightLeft, path: '/transactions' },
    { id: 'expenses' as TabsType, label: 'Expenses', icon: Receipt, path: '/expenses' },
    { id: 'reports' as TabsType, label: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'settings' as TabsType, label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden z-40">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 ${
                active
                  ? 'text-pink-600 dark:text-pink-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;
