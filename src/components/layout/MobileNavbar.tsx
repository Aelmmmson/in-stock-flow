
import { Link } from 'react-router-dom';
import { BarChart, Package, Tag, Settings, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { TabsType } from '@/types';

interface MobileNavbarProps {
  activeTab: TabsType;
  setActiveTab: (tab: TabsType) => void;
}

const MobileNavbar = ({ activeTab, setActiveTab }: MobileNavbarProps) => {
  const tabs = [
    { name: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { name: 'inventory', path: '/inventory', icon: Package, label: 'Inventory' },
    { name: 'transactions', path: '/transactions', icon: ShoppingCart, label: 'Sales' },
    { name: 'reports', path: '/reports', icon: BarChart, label: 'Reports' },
    { name: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-white dark:bg-gray-800 py-2 px-4 z-10">
      <div className="flex justify-between items-center overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <Link
              to={tab.path}
              key={tab.name}
              className={`flex flex-col items-center px-2 py-2 rounded-md relative ${
                isActive
                  ? 'text-pink-500 dark:text-pink-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400'
              }`}
              onClick={() => setActiveTab(tab.name as TabsType)}
            >
              {isActive && (
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-pink-500 dark:bg-pink-400"></span>
              )}
              <tab.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;
