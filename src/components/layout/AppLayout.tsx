
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TabsType } from '@/types';
import MobileNavbar from './MobileNavbar';
import MobileHeader from './MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [activeTab, setActiveTab] = useState<TabsType>('dashboard');
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileHeader activeTab={activeTab} />
      
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6 pb-20 bg-dashboard-pattern">
        {children || <Outlet />}
      </main>
      
      {isMobile && <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
};

export default AppLayout;
