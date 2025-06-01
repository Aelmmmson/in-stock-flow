
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import MobileNavbar from './MobileNavbar';
import DesktopSidebar from './DesktopSidebar';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import { TabsType } from '@/types';
import Breadcrumb from '@/components/navigation/Breadcrumb';

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState<TabsType>('dashboard');
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const toggleNotificationsPanel = () => {
    setNotificationsPanelOpen(!notificationsPanelOpen);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col">
      <MobileHeader
        activeTab={activeTab}
        toggleNotificationsPanel={toggleNotificationsPanel}
      />
      
      {/* Content area with proper spacing for bottom navigation on both mobile and desktop */}
      <main className="flex-1 p-4 pb-20 overflow-auto">
        <Breadcrumb />
        <Outlet />
      </main>
      
      {/* Mobile navbar - only visible on mobile */}
      <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Desktop navbar - only visible on desktop, same bottom position */}
      <DesktopSidebar />
      
      {notificationsPanelOpen && (
        <NotificationsPanel onClose={toggleNotificationsPanel} />
      )}
    </div>
  );
};

export default AppLayout;
