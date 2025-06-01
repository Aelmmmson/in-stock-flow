
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
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
    <Sidebar 
      className="hidden md:flex border-r w-[70px] bg-white" 
      collapsible="none" 
      variant="sidebar"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/2a3413ad-6596-43b9-9a24-eaa892ea1627.png" 
            alt="Didiz Closet" 
            className="h-8 w-8 object-contain" 
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col items-center gap-1 px-1">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title} className="w-full">
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.path)}
                  >
                    <Link 
                      to={item.path} 
                      className={`
                        flex flex-col items-center justify-center
                        p-2 w-full rounded-lg
                        ${isActive(item.path) ? 
                          'text-pink-600' : 
                          'text-gray-500 hover:text-pink-600'}
                      `}
                    >
                      <div className="flex items-center justify-center h-6 w-6">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-center mt-1">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-gray-500 text-center">
          © 2025
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DesktopSidebar;
