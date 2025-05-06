
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
}

// Mock user
const mockUser: User = {
  id: 'user-1',
  name: 'Shop Owner',
  email: 'owner@didizcloset.com',
  role: 'admin',
  phone: '+233 50 123 4567',
  address: 'Accra, Ghana',
  avatar: null
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

  const login = async (email: string, password: string) => {
    // Use static credentials for demo
    if ((email === 'admin@didizcloset.com' && password === 'admin123') || 
        (email === 'owner@didizcloset.com' && password === 'admin123')) {
      setIsAuthenticated(true);
      setCurrentUser(mockUser);
      
      // Store session data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
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
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
