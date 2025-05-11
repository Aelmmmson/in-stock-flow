import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Package, ShoppingCart, BarChart2, Settings } from 'lucide-react';

const DesktopSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'dashboard';
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

  return (
    <Sidebar 
      className="hidden md:flex border-r w-[72px] bg-white" 
      collapsible="none" 
      variant="sidebar"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium">DC</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col items-center gap-1 pt-2 px-1">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title} className="w-full">
                  <SidebarMenuButton 
                    asChild
                  >
                    <Link 
                      to={item.path} 
                      className={`
                        flex flex-col items-center justify-center
                        p-2 w-full rounded-lg
                        ${currentPath === item.path.substring(1) ? 
                          'bg-gray-100 text-primary' : 
                          'text-gray-600 hover:bg-gray-50 hover:text-primary'}
                      `}
                    >
                      <div className="flex items-center justify-center h-6 w-6">
                        {item.icon ? (
                          <item.icon className="h-5 w-5" />
                        ) : (
                          <span className="h-5 w-5 text-red-500">[Icon Missing]</span>
                        )}
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
      
      <SidebarFooter className="p-2 border-t">
        <div className="text-[10px] text-gray-400 text-center">
          © 2025
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DesktopSidebar;
