
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import MobileHeader from './MobileHeader';
import MobileNavbar from './MobileNavbar';
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
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col gap-0 m-0">
        {/* Main content area - flex-1 to take remaining space */}
        <div className="flex-1 flex flex-col min-w-0 m-0 p-0">
          <MobileHeader
            activeTab={activeTab}
            toggleNotificationsPanel={toggleNotificationsPanel}
          />
          
          {/* Content area with proper spacing */}
          <main className="flex-1 p-4 pb-20 md:pb-4 overflow-auto">
            <Breadcrumb />
            <Outlet />
          </main>
          
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
