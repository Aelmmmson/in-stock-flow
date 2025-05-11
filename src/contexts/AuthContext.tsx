
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define specific role types for better type safety
export type UserRole = 'superadmin' | 'admin' | 'owner' | 'manager' | 'cashier' | 'attendant';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string | null;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  hasAdminAccess: () => boolean; // Helper function to check if user has admin level access
}

// Mock users for different roles
const mockUsers: Record<string, User> = {
  'owner@didizcloset.com': {
    id: 'user-1',
    name: 'Shop Owner',
    email: 'owner@didizcloset.com',
    role: 'owner',
    phone: '+233 50 123 4567',
    address: 'Accra, Ghana',
    avatar: null
  },
  'admin@didizcloset.com': {
    id: 'user-2',
    name: 'Admin User',
    email: 'admin@didizcloset.com',
    role: 'admin',
    phone: '+233 50 987 6543',
    address: 'Accra, Ghana',
    avatar: null
  },
  'cashier@didizcloset.com': {
    id: 'user-3',
    name: 'Cashier',
    email: 'cashier@didizcloset.com',
    role: 'cashier',
    phone: '+233 50 456 7890',
    address: 'Accra, Ghana',
    avatar: null
  }
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on component mount
    const checkSession = () => {
      const sessionExists = localStorage.getItem('isAuthenticated') === 'true';
      const userData = localStorage.getItem('currentUser');
      
      if (sessionExists && userData) {
        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  // Check if user has admin-level access
  const hasAdminAccess = () => {
    if (!currentUser) return false;
    return ['superadmin', 'admin', 'owner', 'manager'].includes(currentUser.role);
  };

  const login = async (email: string, password: string) => {
    // For demo purposes, check if we have a mock user with this email
    if (mockUsers[email] && password === 'admin123') {
      const user = mockUsers[email];
      setIsAuthenticated(true);
      setCurrentUser(user);
      
      // Store session data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    
    // Clear session data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  };
  
  const updateUserProfile = async (userData: Partial<User>) => {
    if (!currentUser) {
      throw new Error('No user is logged in');
    }
    
    // Update user data
    const updatedUser = {
      ...currentUser,
      ...userData
    };
    
    setCurrentUser(updatedUser);
    
    // Update stored user data
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      currentUser,
      login, 
      logout,
      updateUserProfile,
      hasAdminAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};
