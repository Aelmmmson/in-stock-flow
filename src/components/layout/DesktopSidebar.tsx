
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ArrowRightLeft, BarChart3, Settings, Receipt } from 'lucide-react';

const DesktopSidebar = () => {
  const location = useLocation();
  
  // Using the exact same menu items as mobile navigation
  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'inventory', title: 'Inventory', icon: Package, path: '/inventory' },
    { id: 'transactions', title: 'Transactions', icon: ArrowRightLeft, path: '/transactions' },
    { id: 'expenses', title: 'Expenses', icon: Receipt, path: '/expenses' },
    { id: 'reports', title: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'settings', title: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 hidden md:block z-40">
      <div className="grid grid-cols-6 h-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 ${
                active
                  ? 'text-pink-600 dark:text-pink-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-pink-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DesktopSidebar;
