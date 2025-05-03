
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      // Simple validation
      if (email && password) {
        // In a real app, this would call an authentication API
        localStorage.setItem('user', JSON.stringify({ 
          name: 'Admin User', 
          email,
          role: 'admin',
          avatar: '/lovable-uploads/453620d9-01b8-4040-aec4-9f948e52aae1.png'
        }));
        
        toast({
          title: "Login successful",
          description: "Welcome to Didiz Closet!",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: "Please enter valid credentials",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="h-20 w-20 mb-4">
          <img 
            src="/lovable-uploads/453620d9-01b8-4040-aec4-9f948e52aae1.png" 
            alt="Didiz Closet Logo" 
            className="h-full w-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-center">Didiz Closet</h1>
        <p className="text-gray-500 text-center mt-2">Inventory Management System</p>
      </div>
      
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">Login to your account</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <button
                type="button"
                className="text-pink-500 hover:text-pink-600"
              >
                Forgot password?
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
