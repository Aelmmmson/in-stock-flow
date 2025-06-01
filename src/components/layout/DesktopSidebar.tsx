
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Package, BarChart2, Settings, ShoppingCart } from 'lucide-react';

const DesktopSidebar = () => {
  const location = useLocation();
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      title: 'Inventory',
      icon: Package,
      path: '/inventory'
    },
    {
      title: 'Sales',
      icon: ShoppingCart,
      path: '/transactions'
    },
    {
      title: 'Reports',
      icon: BarChart2,
      path: '/reports'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings'
    }
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
                          'bg-gray-100 text-primary' : 
                          'text-gray-600 hover:bg-gray-50 hover:text-primary'}
                      `}
                    >
                      <div className="flex items-center justify-center h-6 w-6">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-medium text-center mt-1">
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
