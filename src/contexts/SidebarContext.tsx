
import { createContext, useContext, ReactNode } from 'react';
import { SidebarProvider as UISidebarProvider, useSidebar as useUISidebar } from '@/components/ui/sidebar';

interface SidebarContextProps {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
  open: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  // Use the UI sidebar provider which has its own state management
  return (
    <UISidebarProvider defaultOpen={true}>
      {children}
    </UISidebarProvider>
  );
};
