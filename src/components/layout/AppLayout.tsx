
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TabsType } from '@/types';
import MobileNavbar from './MobileNavbar';
import MobileHeader from './MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import Breadcrumb from '../navigation/Breadcrumb';
import NotificationsPanel from '../notifications/NotificationsPanel';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [activeTab, setActiveTab] = useState<TabsType>('dashboard');
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleNotificationsPanel = () => {
    setNotificationsPanelOpen(!notificationsPanelOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-x-hidden">
      <MobileHeader 
        activeTab={activeTab} 
        toggleNotificationsPanel={toggleNotificationsPanel} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-4 pb-20 bg-gray-50 dark:bg-gray-900 overflow-y-auto scrollbar-none">
        <Breadcrumb />
        {children || <Outlet />}
      </main>
      
      {notificationsPanelOpen && (
        <NotificationsPanel onClose={() => setNotificationsPanelOpen(false)} />
      )}
      
      {isMobile && <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
};

export default AppLayout;
