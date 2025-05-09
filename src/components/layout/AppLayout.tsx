
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import MobileHeader from './MobileHeader';
import MobileNavbar from './MobileNavbar';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import DesktopSidebar from '@/components/layout/DesktopSidebar';
import { TabsType } from '@/types';

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState<TabsType>('dashboard');
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const toggleNotificationsPanel = () => {
    setNotificationsPanelOpen(!notificationsPanelOpen);
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DesktopSidebar />
        <div className="flex-1 flex flex-col">
          <MobileHeader
            activeTab={activeTab}
            toggleNotificationsPanel={toggleNotificationsPanel}
          />
          <div className="flex-grow p-4 pb-20 md:pb-4">
            <Outlet />
          </div>
          <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
          {notificationsPanelOpen && (
            <NotificationsPanel onClose={toggleNotificationsPanel} />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
