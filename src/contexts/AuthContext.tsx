
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthContextProps['user']>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Static authentication - always succeeds
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo user - will always log in regardless of credentials
      const demoUser = {
        id: '1',
        name: 'Didiz Closet Admin',
        email: email || 'admin@didizcloset.com',
        role: 'admin',
      };
      
      localStorage.setItem('auth_token', 'demo-token');
      localStorage.setItem('user_data', JSON.stringify(demoUser));
      
      setUser(demoUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
