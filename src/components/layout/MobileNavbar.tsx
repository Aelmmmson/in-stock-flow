
import { Link } from 'react-router-dom';
import { BarChart, Package, FileText, Settings, LayoutDashboard } from 'lucide-react';
import { TabsType } from '@/types';

interface MobileNavbarProps {
  activeTab: TabsType;
  setActiveTab: (tab: TabsType) => void;
}

const MobileNavbar = ({ activeTab, setActiveTab }: MobileNavbarProps) => {
  const tabs = [
    { name: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { name: 'inventory', path: '/inventory', icon: Package, label: 'Inventory' },
    { name: 'transactions', path: '/transactions', icon: FileText, label: 'Transactions' },
    { name: 'reports', path: '/reports', icon: BarChart, label: 'Reports' },
    { name: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white py-2 px-4">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => (
          <Link
            to={tab.path}
            key={tab.name}
            className={`flex flex-col items-center px-3 py-2 rounded-md ${
              activeTab === tab.name
                ? 'text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab(tab.name as TabsType)}
          >
            <tab.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
