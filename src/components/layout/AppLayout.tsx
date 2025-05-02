
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TabsType } from '@/types';
import MobileNavbar from './MobileNavbar';
import MobileHeader from './MobileHeader';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [activeTab, setActiveTab] = useState<TabsType>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileHeader activeTab={activeTab} />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        {children || <Outlet />}
      </main>
      
      <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default AppLayout;
